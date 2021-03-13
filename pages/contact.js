import Intro from '../components/intro'
import Link from 'next/link'
import Layout from '../components/layout'
import Container from '../components/container'
export default function About() {
  return (
    <>
      <Layout>
        <Container>
          <Intro current="contact"/>
          <h1>Contact me</h1>
          <p>You can reach me at clp <span class="text-gray-500">at</span> <span class="text-blue-400 italic">this website's domain</span> through e-mail.</p>
        </Container>
      </Layout>

    </>
  )
}
