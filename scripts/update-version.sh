NODE_VERSION=$(node -p -e "require('./package.json').version")
echo "export default '${NODE_VERSION}';" > src/version.ts