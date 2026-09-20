"""Upload static assets to the restricted FTP account root using verified TLS.

Credentials come exclusively from environment variables. Existing unrelated
remote files are preserved. The HTML entrypoint is transferred last.
"""
import ftplib
import os
from pathlib import Path
import ssl
import sys


def deploy():
    settings = {name: os.environ.get(name, '') for name in
                ('FTP_HOST', 'FTP_USER', 'FTP_PASSWORD')}
    if not all(settings.values()):
        raise ValueError('Required FTP repository secrets are missing')
    root = Path(__file__).resolve().parents[1] / 'dist'
    files = sorted(root.rglob('*'))
    files = [p for p in files if p.is_file() and not p.is_symlink()]
    if not (root / 'index.html').is_file():
        raise ValueError('dist/index.html is missing')
    if any(part.startswith('.') for p in files for part in p.relative_to(root).parts):
        raise ValueError('Hidden files must not be included in the deployment')
    files.sort(key=lambda p: p.name == 'index.html')

    with ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=45) as ftp:
        ftp.connect(settings['FTP_HOST'], 21)
        # Connect to the configured IP, but verify the hosting certificate's
        # actual DNS identity on both the control and data connections.
        ftp.host = os.environ.get('FTP_TLS_SERVER_NAME', settings['FTP_HOST'])
        ftp.login(settings['FTP_USER'], settings['FTP_PASSWORD'])
        ftp.prot_p()
        ftp.set_pasv(True)
        ftp.cwd('/')
        for path in files:
            relative = path.relative_to(root).as_posix()
            ftp.cwd('/')
            for directory in path.relative_to(root).parts[:-1]:
                try:
                    ftp.cwd(directory)
                except ftplib.error_perm:
                    ftp.mkd(directory)
                    ftp.cwd(directory)
            temporary = '.' + path.name + '.uploading'
            with path.open('rb') as source:
                ftp.storbinary('STOR ' + temporary, source)
            ftp.voidcmd('TYPE I')
            if ftp.size(temporary) != path.stat().st_size:
                raise RuntimeError('Uploaded file size mismatch')
            ftp.rename(temporary, path.name)
            print('Published ' + relative)
        ftp.quit()
    print(f'Published {len(files)} files successfully.')


if __name__ == '__main__':
    try:
        deploy()
    except Exception as error:
        # Do not print server responses, environment variables or credentials.
        print('Deployment failed (' + type(error).__name__ +
              '). Check FTP secrets, TLS certificate and account permissions.',
              file=sys.stderr)
        sys.exit(1)
