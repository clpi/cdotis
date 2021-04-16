import Link from 'next/link'
import Layout from '../components/layout'
import Container from '../components/container'
export default function About() {
  return (
    <>
      <Layout>
        <Container>
      <h2 className="mb-8 text-6xl font-light leading-tight tracking-tighter md:text-7xl">
        Contact me
      </h2>
          <p>You can reach me at clp <span class="text-gray-500">at</span> <span class="text-blue-400 italic">this website's domain</span> through e-mail.</p>
        </Container>
      </Layout>

    </>
  )
}
