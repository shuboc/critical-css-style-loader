# critical-css-style-loader

Generate critical CSS during server rendering to prevent CSS from render blocking.

# Install

`npm install critical-css-style-loader`

# Usage

**.babelrc**

```js
"plugins": [
    "critical-css-style-loader/lib/plugin"
]
```

**webpack.server.config.js**

```js
module: {
    rules: [
        {
            test: /\.(css|scss)$/,
            use: [
                'critical-css-style-loader',
                {
                    loader: 'css-loader',
                    options: {
                    modules: true,
                    camelCase: true,
                    importLoaders: 2
                    }
                }
            ]
        },
    ]
}
    
```

**server.js**

```js
import addCss from 'critical-css-style-loader/lib/addCss'

// In render function, collect critical CSS using insertCss, StyleContext and getCssByIds
const ids = []
const {getCssByIds} = addCss

const insertCss = (...styles) => styles.forEach(style => {
    const content = style._getContent()
    content.forEach(item => {
        const id = item[0]
        ids.push(id)
    })
})

const content = renderToString(
    <Provider store={store}>
        <StyleContext insertCss={insertCss}>
            <RouterContext {...props} />
        </StyleContext>
    </Provider>
)

const criticalCss = getCssByIds(ids)

// Use your favorite template engine to inline critical CSS
res.render('index', {criticalCss})
```

**index.pug**

The CSS bundle can be loaded asynchronously since all necessary CSS are inlined with the document during the process of server rendering.

```
style.
    !{initialCss}

link(rel='stylesheet' href='/static/styles.css' media='none' onload="if(media!='all')media='all'")
```