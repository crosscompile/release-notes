const path = require('path')
const fs = require('fs')
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

let releaseEdges

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const releaseTemplate = path.resolve('./src/templates/ReleaseTemplate.js')
  const releasesTemplate = path.resolve('./src/templates/ReleasesTemplate.js')

  const query = `
      {
        site {
          siteMetadata {
            title
          }
        }
        repository: allGithubRepo {
          edges {
            node {
              name
            }
          }
        }
        releases: allGithubRelease(filter: { draft: { eq: false } }) {
          edges {
            node {
              name
              tagName
              publishedAt
            }
          }
        }
      }
    `

  const result = await graphql(query)
  releaseEdges = result.data.releases.edges

  result.data.releases.edges.forEach(({ node: { name, tagName } }) => {
    createPage({
      path: `/${tagName}`,
      component: releaseTemplate,
      context: {
        ogText: name || tagName,
        tagName,
      },
    })
  })

  const ogText =
    result.data.site.siteMetadata.title ||
    result.data.repository.edges[0].node.name

  createPage({
    path: `/`,
    component: releasesTemplate,
    context: {
      ogText,
      isWidget: false,
    },
  })

  createPage({
    path: `/widget`,
    component: releasesTemplate,
    context: {
      ogText,
      isWidget: true,
    },
  })
}

exports.sourceNodes = async ({
  store,
  cache,
  createNodeId,
  actions: { createNode },
}) => {
  if (process.env.LOGO_URL) {
    await createRemoteFileNode({
      url: process.env.LOGO_URL,
      store,
      cache,
      createNode,
      createNodeId,
      name: 'logo',
    })
  }
}

exports.onPostBuild = () =>
  fs.writeFileSync(
    path.resolve(process.cwd(), 'public', 'release-dates.json'),
    JSON.stringify(
      releaseEdges.slice(0, 10).map(({ node: { publishedAt } }) => publishedAt)
    )
  )
