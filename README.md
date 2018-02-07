# critical-css-style-loader

Remove CSS bundle from [critical rendering path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/) to make [first contentful paint](https://gtmetrix.com/blog/first-contentful-paint-explained/) much faster by dynamically generate critical CSS during server rendering.

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
                        modules: true
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

const {getCssByIds} = addCss
const criticalCss = getCssByIds(ids)

// Use your favorite template engine to inline critical CSS
res.render('index', {criticalCss})
```

**index.pug**

The CSS bundle can be loaded asynchronously and will not block rendering since all critical CSS are inlined with the document during the process of server rendering.

```
style.
    !{initialCss}

link(rel='stylesheet' href='/static/styles.css' media='none' onload="if(media!='all')media='all'")
```