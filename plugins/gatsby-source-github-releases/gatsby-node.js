const Octokat = require('octokat')
const md5 = require('md5')
const parseGitUrl = require('git-url-parse')
const { linkify } = require('linkify-markdown')
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

exports.sourceNodes = async (
  { actions: { createNode }, createNodeId, createContentDigest, store, cache },
  pluginOptions
) => {
  const { owner, name } = parseGitUrl(pluginOptions.url)
  const octo = new Octokat({ token: pluginOptions.token })
  const repoResource = octo.repos(owner, name)

  const repo = await repoResource.fetch()
  const repoId = createNodeId(repo.fullName)
  const repoContent = JSON.stringify(repo)

  const releases = await repoResource.releases.fetchAll()

  const releaseIds = []

  releases.forEach(release => {
    const releaseId = createNodeId(release.tagName)
    const releaseBodyId = createNodeId(`${release.tagName}_body`)
    const releaseContent = JSON.stringify(release)

    releaseIds.push(releaseId)

    createNode({
      ...release,
      id: releaseId,
      parent: repoId,
      children: [releaseBodyId],
      internal: {
        type: 'GithubRelease',
        contentDigest: createContentDigest(releaseContent),
        content: releaseContent,
      },
    })
    const releaseBodyContent = linkify(release.body, {
      repository: pluginOptions.url,
    })

    createNode({
      id: releaseBodyId,
      parent: releaseId,
      children: [],
      internal: {
        type: 'GithubReleaseBody',
        mediaType: 'text/markdown',
        contentDigest: createContentDigest(releaseBodyContent),
        content: releaseBodyContent,
      },
    })
  })

  const avatarImageFile = await createRemoteFileNode({
    url: repo.owner.avatarUrl,
    store,
    cache,
    createNode,
    createNodeId,
  })

  createNode({
    homepage: null,
    ...repo,
    id: repoId,
    parent: null,
    children: [...releaseIds, avatarImageFile.id],
    internal: {
      type: 'GithubRepo',
      contentDigest: createContentDigest(repoContent),
      content: repoContent,
    },
  })
}
