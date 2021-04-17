import Link from 'next/link'
import Head from 'next/head';
import Layout from '../components/layout'
import Container from '../components/container'
export default function About() {
  return (
    <>
      <Head>
        <title>contact - clp.is chris pecunies</title>
      </Head>
      <Layout current="contact">
        <Container>
          <div class="inline-block mb-0 mt-5 grid grid-cols-2">
            <div class="float-left mr-8">
      <h2 className="mb-8 text-6xl font-light leading-tight tracking-tighter">
        contact me
      </h2>
            </div>
            <div class="ml-24 float-right text-sm">
          <a href="mailto:clp@clp.is"><button class="px-5 py-3 rounded-lg shadow bg-green-500 text-white mr-4">Contact me</button></a>

          <a href="mailto:chris@devisa.io"><button class="px-5 py-3 rounded-lg shadow bg-white-500 text-black">Schedule me</button></a>
            </div>
          </div>
          <div class="border-l-4 border-green-300 pl-8">
          <p>You can reach me at clp <span class="text-gray-500">at</span> <span class="text-green-400 italic">this website's domain</span> through e-mail.</p>
          <br/>
          <p>Or chris <span class="text-green-500">at this website's domain</span>, again over email.</p>
          <br/>
          <p>Other links you might find useful:</p>
            <br/>
          <ul class=" border-l-2 border-yellow-300 pl-4 list-outside ml-8">
            <li>1. <a class="text-green-500" href="http://last.fm/user/ooohm">My last.fm profile</a></li>
            <li>2. <a class="text-green-500" href="http://linkedin.com/in/chrispecunies">My LinkedIn profile</a></li>
            <li>3. <a class="text-green-500" href="http://github.com/clpi">My GitHub</a></li>
            <li>4. <a class="text-green-500" href="http://gitlab.com/clpi">My GitLab</a></li>
            <li>5. <a class="text-green-500" href="https://open.spotify.com/user/12180738991">My Spotify</a></li>
            <li>6. <a class="text-green-500" href="http://facebook.com/chrispecunies">My Facebook</a></li>
            <li>7. <a class="text-green-500" href="https://devisa.io/chris">My Devisa profile</a></li>
          </ul>
          </div>
        </Container>
      </Layout>

    </>
  )
}
