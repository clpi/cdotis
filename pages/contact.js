import Link from 'next/link'
import Layout from '../components/layout'
import Container from '../components/container'
export default function About() {
  return (
    <>
      <Layout current="contact">
        <Container>
      <h2 className="mb-8 text-5xl font-light leading-tight tracking-tighter">
        contact me
      </h2>
          <p>You can reach me at clp <span class="text-gray-500">at</span> <span class="text-green-400 italic">this website's domain</span> through e-mail.</p>
          <br/>
          <p>Or chris <span class="text-green-500">at this website's domain</span>, again over email.</p>
          <p>Other links you might find useful:</p>
          <ul class="list-outside ml-8">
            <li>1. <a class="text-green-500" href="http://last.fm/user/ooohm">My last.fm profile</a></li>
            <li>2. <a class="text-green-500" href="http://linkedin.com/in/chrispecunies">My LinkedIn profile</a></li>
            <li>3. <a class="text-green-500" href="http://github.com/clpi">My GitHub</a></li>
            <li>4. <a class="text-green-500" href="http://gitlab.com/clpi">My GitLab</a></li>
            <li>5. <a class="text-green-500" href="https://open.spotify.com/user/12180738991">My Spotify</a></li>
            <li>6. <a class="text-green-500" href="http://facebook.com/chrispecunies">My Facebook</a></li>
            https://open.spotify.com/user/12180738991
          </ul>
        </Container>
      </Layout>

    </>
  )
}
