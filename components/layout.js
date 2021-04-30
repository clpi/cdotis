import Nav from './ui/nav';
import Link from 'next/link';
import { Router } from 'next/router';
import Alert from '../components/alert'
import Footer from '../components/footer'
import Meta from '../components/meta'

export default function Layout(props) {
  return (
    <div class=" w-full overflow-x-hidden bg-gradient-to-br from-gray-100 to-gray-50 min-h-screen min-h-full h-full overflow-y-visible block pb-16">
      <Meta />
      <Nav/>
      <br/>
      <br/>
      <br/>
      <br/>
      <div class="w-2/3 mx-auto  px-32 py-6 bg-white rounded-xl shadow">
        <main>{props.children}</main>
      </div>
      {/* <Footer /> */}
    </div>
  )
}
