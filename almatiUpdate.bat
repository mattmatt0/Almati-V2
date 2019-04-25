echo commentaire:
set /p message= 
cd /D %CD%
git add .
git commit -am "%message%"

git push origin master