import AppLayout from '../components/MainPage/AppLayout';
import MainPageContent from '../components/MainPage/MainPageContent';

export default function Home() {
  return (
    <main className="bg-dark text-white min-h-screen">
      <AppLayout>
        <MainPageContent />
      </AppLayout>
    </main>
  );
}