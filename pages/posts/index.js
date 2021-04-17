import PostPreview from '../../components/post-preview'
import Layout from '../../components/layout'
import Container from '../../components/container'
import { getAllPosts } from '../../lib/api'
import Head from 'next/head'

export default function Posts({ allPosts }) {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  return (
    <>
      <Head>
        <title>posts - clp.is chris pecunies</title>
      </Head>
      <Layout current="posts">
        <Container>
          <div class="inline-block mb-0 mt-5 grid grid-cols-2">
            <div class="float-left mr-8">
      <h2 className="mb-8 text-6xl font-light leading-tight tracking-tighter">
        my posts
      </h2>
            </div>
            <div class="ml-24 float-right text-sm">
          <a href="mailto:clp@clp.is"><button class="px-5 py-3 rounded-lg shadow bg-green-500 text-white mr-4">Contact me</button></a>

          <a href="mailto:chris@devisa.io"><button class="px-5 py-3 rounded-lg shadow bg-white-500 text-black">Schedule me</button></a>
            </div>
          </div>
          <div class="border-l-4 border-green-300 pl-8">
          {morePosts.length >= 0 &&
    <section>
      <div className="mb-32 grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32">
        {allPosts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
    </section>
            }
          </div>
        </Container>
      </Layout>

    </>
  )
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])

  return {
    props: { allPosts },
  }
}
