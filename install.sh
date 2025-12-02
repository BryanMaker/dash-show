echo "Creat directory dash-show@BryanMaker"
mkdir -p dash-show@BryanMaker

echo "Copy extension.js metadata.json to folder dash-show@BryanMaker"
cp extension.js dash-show@BryanMaker
cp metadata.json dash-show@BryanMaker

echo "Archive folder dash-show@BryanMaker to dash-show@BryanMaker.zip"
zip -r dash-show@BryanMaker.zip dash-show@BryanMaker

echo "gnome-extensions install -f dash-show@BryanMaker.zip..."
gnome-extensions install -f dash-show@BryanMaker.zip

echo "Clean up"
\rm -r dash-show@BryanMaker dash-show@BryanMaker.zip
