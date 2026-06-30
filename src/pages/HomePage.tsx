import AmoaLogo from "../assets/AMOA3.png";

const HomePage = () => {
  return (
    <div className="p-6 text-center">
      <img 
        src={AmoaLogo} 
        alt="AMOA 로고" 
        className="mx-auto w-75 h-auto object-contain" 
      />
      <h1 className="text-2xl font-bold mb-2 mt-4">💅 AMOA 홈 페이지</h1>
      <p className="text-gray-600">
        HomePage 
      </p>
    </div>
  );
};

export default HomePage;