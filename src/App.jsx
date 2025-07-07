import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

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

const imageBase64 = "/Image.png";

const menuItems = [
  { id: 1, name: '藍莓起司蛋糕', description: '濃郁藍莓與起司交織出的完美滋味', price: 120, image: imageBase64, category: '精選甜點' },
  { id: 2, name: '提拉米蘇', description: '經典義式風味，口感綿密', price: 110, image: imageBase64, category: '精選甜點' },
  { id: 6, name: '草莓千層', description: '層層酥皮搭配新鮮草莓', price: 130, image: imageBase64, category: '精選甜點' },
  { id: 7, name: '檸檬塔', description: '酸甜交融的清新選擇', price: 115, image: imageBase64, category: '精選甜點' },
  { id: 3, name: '拿鐵咖啡', description: '香醇牛奶與咖啡的經典搭配', price: 90, image: imageBase64, category: '咖啡飲品' },
  { id: 4, name: '抹茶歐蕾', description: '日式抹茶與鮮奶的溫潤口感', price: 100, image: imageBase64, category: '咖啡飲品' },
  { id: 8, name: '卡布奇諾', description: '濃郁咖啡與奶泡的完美比例', price: 95, image: imageBase64, category: '咖啡飲品' },
  { id: 9, name: '冰釀咖啡', description: '低溫萃取，回甘無苦味', price: 105, image: imageBase64, category: '咖啡飲品' },
  { id: 5, name: '法式三明治', description: '法式麵包搭配煙燻火腿與起司', price: 130, image: imageBase64, category: '輕食套餐' },
  { id: 10, name: '煙燻鮭魚沙拉', description: '新鮮蔬菜佐鮭魚，清爽健康', price: 140, image: imageBase64, category: '輕食套餐' },
  { id: 11, name: '帕尼尼組合餐', description: '熱壓帕尼尼與湯品的組合', price: 135, image: imageBase64, category: '輕食套餐' },
];

function App() {
  const [order, setOrder] = useState([]);
  const [category, setCategory] = useState('精選甜點');
  const [page, setPage] = useState('home');
  const [language, setLanguage] = useState('zh');
  const [success, setSuccess] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const addToOrder = (item) => {
    const exists = order.find((o) => o.id === item.id);
    if (exists) {
      setOrder((prev) => prev.map((o) => o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o));
    } else {
      setOrder((prev) => [...prev, { ...item, quantity: 1 }]);
    }
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
      setSuccess(true);
      clearOrder();
      setTimeout(() => setSuccess(false), 2500);
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
      address: "地址：新北市三重區正義北路31號",
      description: "我們是一家專注於午後甜點與咖啡體驗的溫馨小店，歡迎光臨！",
      addToOrder: "加入點單",
      remove: "移除",
      total: "總計",
      clear: "清除清單",
      submit: "送出訂單",
      empty: "目前尚未選擇任何餐點",
      submitted: "🎉 訂單送出成功！感謝您的惠顧！"
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
      empty: "No items selected yet",
      submitted: "🎉 Order submitted! Thank you!"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 pb-20 relative">
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

      {success && (
        <>
          <motion.div className="fixed top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
            {text[language].submitted}
          </motion.div>
          <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={250} recycle={false} />
        </>
      )}

      {page === 'home' && (
        <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-xl font-bold text-orange-600 mb-2">{text[language].businessHours}</h2>
          <p className="text-gray-700 mb-2">{text[language].address}</p>
          <p className="text-gray-600">{text[language].description}</p>
        </motion.div>
      )}

      {page === 'menu' && (
        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-full border ${category === c ? 'bg-orange-500 text-white' : 'text-orange-600 border-orange-300 hover:bg-orange-100'}`}>{c}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {menuItems.filter((item) => item.category === category).map((item) => (
              <motion.div key={item.id} className="bg-white p-2 rounded-xl shadow hover:shadow-lg cursor-pointer" whileHover={{ scale: 1.03 }} onClick={() => setModalItem(item)}>
                <img src={item.image} alt={item.name} className="rounded-md w-full h-32 object-cover" />
                <div className="mt-2">
                  <h3 className="font-bold text-orange-600">{item.name}</h3>
                  <p className="text-sm text-gray-600">${item.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {modalItem && (
          <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-xl relative" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <button onClick={() => setModalItem(null)} className="absolute top-2 right-2 text-gray-500">✕</button>
              <img src={modalItem.image} alt={modalItem.name} className="rounded-md w-full h-40 object-cover mb-4" />
              <h3 className="font-bold text-lg text-orange-600 mb-1">{modalItem.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{modalItem.description}</p>
              <button onClick={() => { addToOrder(modalItem); setModalItem(null); }} className="px-4 py-2 bg-orange-500 text-white rounded-full">{text[language].addToOrder}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {page === 'order' && (
        <motion.div className="p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {order.length === 0 ? (
            <p className="text-center text-gray-500">{text[language].empty}</p>
          ) : (
            <motion.ul initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              {order.map((item) => (
                <motion.li key={item.id} className="flex justify-between items-center bg-white p-3 mb-2 rounded shadow" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <div>
                    <h4 className="font-semibold text-orange-600">{item.name}</h4>
                    <p className="text-sm text-gray-600">x{item.quantity}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500">{text[language].remove}</button>
                </motion.li>
              ))}
            </motion.ul>
          )}
          {order.length > 0 && (
            <div className="mt-4 text-right">
              <p className="font-bold text-lg text-orange-600">{text[language].total}: ${total}</p>
              <button onClick={clearOrder} className="text-sm text-gray-500 mr-4">{text[language].clear}</button>
              <button onClick={submitOrder} className="px-4 py-2 bg-green-500 text-white rounded-full">{text[language].submit}</button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default App;
