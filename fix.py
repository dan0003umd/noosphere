content = open('src/store/useStore.ts', 'r').read()
content = content.replace('const apiKey = AIzaSyDeSKHH_JBhoh07gBF2JD8gWYzBbp5k1VE;', 'const apiKey = "AIzaSyDeSKHH_JBhoh07gBF2JD8gWYzBbp5k1VE";')
open('src/store/useStore.ts', 'w').write(content)
print('Done!')
