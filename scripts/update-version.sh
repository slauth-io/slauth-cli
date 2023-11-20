NODE_VERSION=$(node -p -e "require('./package.json').version")
echo "export default '${NODE_VERSION}';" > src/version.ts

echo 'UPDATING VERSION'

cat src/version.ts

pwd

ls