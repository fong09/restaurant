import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categories = ["精選甜點", "咖啡飲品", "輕食套餐"];

const imageBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...";

const menuItems = [
  { id: 1, name: '藍莓起司蛋糕', price: 120, image: imageBase64, category: '精選甜點', description: '香濃藍莓與起司完美融合' },
  { id: 2, name: '提拉米蘇', price: 110, image: imageBase64, category: '精選甜點', description: '經典義式甜點，濃郁咖啡香' },
  { id: 6, name: '草莓千層', price: 130, image: imageBase64, category: '精選甜點', description: '層層酥皮與草莓香氣' },
  { id: 7, name: '檸檬塔', price: 115, image: imageBase64, category: '精選甜點', description: '酸甜平衡的檸檬風味' },
  { id: 3, name: '拿鐵咖啡', price: 90, image: imageBase64, category: '咖啡飲品', description: '溫潤順口的經典拿鐵' },
  { id: 4, name: '抹茶歐蕾', price: 100, image: imageBase64, category: '咖啡飲品', description: '抹茶與牛奶的柔和口感' },
  { id: 8, name: '卡布奇諾', price: 95, image: imageBase64, category: '咖啡飲品', description: '濃縮與奶泡的完美結合' },
  { id: 9, name: '冰釀咖啡', price: 105, image: imageBase64, category: '咖啡飲品', description: '冷萃技術打造滑順風味' },
  { id: 5, name: '法式三明治', price: 130, image: imageBase64, category: '輕食套餐', description: '經典火腿起司法國麵包' },
  { id: 10, name: '煙燻鮭魚沙拉', price: 140, image: imageBase64, category: '輕食套餐', description: '健康清爽的煙燻鮭魚搭配新鮮蔬菜' },
  { id: 11, name: '帕尼尼組合餐', price: 135, image: imageBase64, category: '輕食套餐', description: '熱壓帕尼尼搭配飲品與沙拉' },
];

function App() {
  const [order, setOrder] = useState([]);
  const [category, setCategory] = useState('精選甜點');
  const [page, setPage] = useState('home');
  const [language, setLanguage] = useState('zh');
  const [modalItem, setModalItem] = useState(null);

  const addToOrder = (item) => {
    const exists = order.find((o) => o.id === item.id);
    if (exists) {
      setOrder((prev) => prev.map((o) => o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o));
    } else {
      setOrder((prev) => [...prev, { ...item, quantity: 1 }]);
    }
    setModalItem(null);
  };

  const removeItem = (id) => {
    setOrder((prev) => prev.filter((item) => item.id !== id));
  };

  const clearOrder = () => {
    setOrder([]);
  };

  const submitOrder = async () => {
    try {
      await addDoc(collection(db, "orders"), {
        items: order,
        total,
        createdAt: Timestamp.now()
      });
      alert("訂單已送出！");
      clearOrder();
    } catch (e) {
      alert("送出訂單失敗：" + e.message);
    }
  };

  const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const text = {
    zh: {
      title: "秋森萬 Café",
      intro: "點選你想享用的下午茶",
      home: "首頁",
      menu: "菜單",
      order: "我的點單",
      businessHours: "營業時間：每日 10:00 - 18:00",
      address: "地址：新北市三重區正義北路33巷31號",
      description: "我們是一家專注於午後甜點與咖啡體驗的溫馨小店，歡迎光臨！",
      addToOrder: "加入點單",
      remove: "移除",
      total: "總計",
      clear: "清除清單",
      submit: "送出訂單",
      scan: "📱 掃描 QR Code 取得訂單",
      empty: "目前尚未選擇任何餐點"
    },
    en: {
      title: "Afternoon Café",
      intro: "Choose your favorite dessert and drink",
      home: "Home",
      menu: "Menu",
      order: "My Order",
      businessHours: "Open: 10:00 - 18:00 daily",
      address: "Address: No.123, Some Street, Taipei",
      description: "A cozy cafe offering sweet moments and relaxing drinks.",
      addToOrder: "Add to Order",
      remove: "Remove",
      total: "Total",
      clear: "Clear",
      submit: "Submit",
      scan: "📱 Scan QR Code to view your order",
      empty: "No items selected yet"
    }
  };

  const heroImages = [imageBase64, imageBase64, imageBase64];
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 pb-20">
      <header className="bg-white shadow rounded-xl p-4 flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-orange-600 animate-bounce">☕ {text[language].title}</h1>
        <button onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')} className="text-sm text-gray-600 underline">
          {language === 'zh' ? 'English' : '中文'}
        </button>
      </header>

      <nav className="flex justify-around bg-white shadow-md p-2 fixed bottom-0 left-0 w-full z-10 md:static md:w-auto md:p-0 md:shadow-none md:justify-start gap-4">
        {['home', 'menu', 'order'].map((key) => (
          <button key={key} onClick={() => setPage(key)} className={`px-4 py-2 rounded ${page === key ? 'bg-orange-500 text-white' : 'text-orange-600'}`}>{text[language][key]}</button>
        ))}
      </nav>

      {page === 'home' && (
        <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Slider {...sliderSettings}>
            {heroImages.map((img, idx) => (
              <div key={idx}>
                <img src={img} alt="cafe" className="rounded-xl w-full h-48 object-cover" />
              </div>
            ))}
          </Slider>
          <h2 className="text-xl font-bold text-orange-600 mt-4 mb-2">{text[language].businessHours}</h2>
          <p className="text-gray-700 mb-2">{text[language].address}</p>
          <p className="text-gray-600">{text[language].description}</p>
        </motion.div>
      )}

      {page === 'menu' && (
        <motion.div className="p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-lg mb-2 text-gray-700">{text[language].intro}</h2>
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${category === cat ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {menuItems.filter(item => item.category === category).map((item) => (
              <motion.div key={item.id} className="bg-white rounded-xl shadow p-3 flex flex-col cursor-pointer" whileHover={{ scale: 1.05 }} onClick={() => setModalItem(item)}>
                <img src={item.image} alt={item.name} className="rounded w-full h-28 object-cover mb-2" />
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600">${item.price}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {modalItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md max-w-sm w-full">
            <img src={modalItem.image} alt={modalItem.name} className="w-full h-40 object-cover rounded mb-3" />
            <h2 className="text-lg font-bold mb-1">{modalItem.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{modalItem.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-orange-600 font-semibold">${modalItem.price}</span>
              <button onClick={() => addToOrder(modalItem)} className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600">
                {text[language].addToOrder}
              </button>
            </div>
            <button onClick={() => setModalItem(null)} className="mt-3 text-xs text-gray-500 underline block text-center">關閉</button>
          </div>
        </div>
      )}

      {page === 'order' && (
        <motion.div className="p-6 bg-white mx-4 rounded-xl shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-xl font-bold mb-4 text-orange-600">🧾 {text[language].order}</h2>
          {order.length > 0 ? (
            <div>
              <ul className="space-y-2">
                {order.map((item) => (
                  <li key={item.id} className="flex justify-between items-center">
                    <div className="text-sm">
                      {item.name} x {item.quantity} = ${item.price * item.quantity}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:underline">
                      {text[language].remove}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="text-right text-lg font-semibold mt-4">
                {text[language].total}：<span className="text-orange-600">${total}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={clearOrder} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                  {text[language].clear}
                </button>
                <button onClick={submitOrder} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  {text[language].submit}
                </button>
              </div>
              <div className="mt-6 border rounded p-4 bg-white inline-block">
                <p className="text-xs text-gray-500 mb-2">{text[language].scan}</p>
                <QRCode value={JSON.stringify(order)} size={120} />
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">{text[language].empty}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default App;
