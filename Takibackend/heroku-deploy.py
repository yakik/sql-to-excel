import os
import shutil
import sys

FILE_PATH = os.path.dirname(os.path.realpath(__file__))





def buildDocker():
    os.system('docker build -t remote-games .')


def deploy():
    os.system('heroku container:login')
    os.system('heroku container:push --app card-game989 web')
    os.system('heroku container:release --app card-game989 web')


def main():
    buildDocker()
    deploy()


if __name__ == "__main__":
    main()