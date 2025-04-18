import Footer from '../Footer'
import Navbar from '../Navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="layout">
			<Navbar />
			<main>{children}</main>
            <Footer />
		</div>
	)
}
