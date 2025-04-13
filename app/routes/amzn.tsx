export default function Amzn() {
  const products = [
    {
      title: "Airtag Bottle Holder",
      link: "https://amzn.to/3G8wqGr",
      image: "https://m.media-amazon.com/images/I/61pxYlBZ9RL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      description: "Secure holder for your Airtag on your bike"
    },
    {
      title: "Sunlite Cloud9 Suspension Saddle",
      link: "https://amzn.to/43QdyG3",
      image: "https://m.media-amazon.com/images/I/51bZLeecIPL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
      description: "Comfortable suspension saddle for long rides"
    },
    {
      title: "SR Suntour Suspension Seatpost",
      link: "https://amzn.to/42cfrM2",
      image: "https://m.media-amazon.com/images/I/41qyNtuJkuL._AC_SX679_.jpg",
      description: "Smooth suspension seatpost for added comfort"
    },
    {
      title: "Handlebar Rearview Mirror",
      link: "https://amzn.to/3RK7CXI",
      image: "https://m.media-amazon.com/images/I/61I2hPZxXWL._AC_SX679_.jpg",
      description: "Clear rearview mirror for better visibility"
    },
    {
      title: "EBike Crank Arms",
      link: "https://amzn.to/3Rfqxtm",
      image: "https://m.media-amazon.com/images/I/7167ti6TNRL._AC_SX679_.jpg",
      description: "Shorter cranks help prevent pedal strikes"
    },
    {
      title: '3M Spoke Reflectors',
      link: 'https://amzn.to/4lsYILR',
      image: 'https://m.media-amazon.com/images/I/61Sf4GZU0XS._AC_SX679_.jpg',
      description: 'High quality, high visibility reflectors'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-100 mb-8 text-center">Affiliate Links</h1>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-200 mb-6">Bicycle Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <a 
                key={index}
                href={product.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-slate-100">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-slate-300">{product.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}