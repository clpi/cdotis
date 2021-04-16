import Container from '../components/container'
import Layout from '../components/layout'
import Head from 'next/head'

export default function Index() {
  return (
      <Layout>
      <Head>
        <title>home - clp.is chris pecunies</title>
      </Head>
        <Container>
      <h2 className="mb-8 text-5xl font-light leading-tight tracking-tighter">
        welcome to clp.is
      </h2>
          <div class="border-l-4 border-green-300 pl-8">
          <p>I'm Chris. This is my personal webpage(s). Welcome! I will, in theory, be using this website to keep track of my endeavors for the sake of others, but it is still to be seen whether I will be posting on here and keeping these collection of pages updated, so if you're trying to get ahold of me/keep up to date with what I'm doing, better off just shooting me a message directly! If you have a business or service related inquiry, please do the same!</p>
            <br/><br/>
      <h2 className="mb-8 text-3xl font-light leading-tight tracking-tighter">
        what's new?
      </h2>
            <p>These days (current as of April 2021), the vast majority of my focus is dedicated towards <a class="text-green-500" href="https://devisa.io">Devisa</a>, a project/business/company aiming towards providing life data and workflow automation services and software. Through Devisa, I'm spending a lot of time attempting to build a life data management and life task automation solution that will, at the very least, ideally work well enough to solve a lot of woes I personally encounter on a daily basis to keep myself productive and moving in the right direction. If you want to follow my progress on Devisa, please check back here periodically for updates, to be posted on the blog!</p>
            <br/><br/>

      <h2 className="mb-8 text-3xl font-light leading-tight tracking-tighter">
        who am i?
      </h2>
      <p>Nobody important, right now. That said, if you're interested in Devisa or are looking for software development work on either end of the stack (or both!) I can make myself available for the time being, depending on the type of work involved. I have extensive experience using and building software with Python, Java/Kotlin, Flutter, HTML/CSS/JavaScript, Node.js, Rust, Scala, and other languages, and I have extensive experience working with all cloud providers to set up and maintain various cloud architecture solutions (with a strong emphasis on AWS-based services).</p>
          {/* {morePosts.length > 0 && <MoreStories posts={morePosts} />} */}
          </div>
        </Container>
      </Layout>
  )
}

