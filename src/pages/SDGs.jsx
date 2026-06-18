import SDGStory from '../components/SDGStory';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { goHome } from '../App';

export default function SDGs() {
  return (
    <>
      <Nav />
      <main>
        <SDGStory />
      </main>
      <Footer />
    </>
  );
}
