import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { Home, Menu, ShoppingCart } from 'lucide-react';

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

const categories = ["熱門推薦", "主食", "湯品"];

const menuItems = [
  { id: 1, name: '滷肉飯', price: 60, image: 'https://source.unsplash.com/160x100/?rice', category: '主食', desc: '經典台灣風味的滷肉飯，搭配香Q白飯。' },
  { id: 2, name: '雞腿便當', price: 100, image: 'https://source.unsplash.com/160x100/?chicken', category: '主食', desc: '酥炸雞腿搭配配菜與白飯，是最受歡迎的選擇。' },
  { id: 3, name: '味噌湯', price: 30, image: 'https://source.unsplash.com/160x100/?soup', category: '湯品', desc: '日式味噌湯，溫暖你的胃。' },
  { id: 4, name: '紅燒牛肉麵', price: 120, image: 'https://source.unsplash.com/160x100/?noodles', category: '主食', desc: '紅燒湯頭搭配軟嫩牛肉與拉麵，風味十足。' },
  { id: 5, name: '排骨飯', price: 90, image: 'https://source.unsplash.com/160x100/?pork', category: '熱門推薦', desc: '炸排骨香酥可口，是每日限量供應的餐點。' },
];

function App() {
  const [order, setOrder] = useState([]);
  const [category, setCategory] = useState('熱門推薦');
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  const addToOrder = (item) => {
    const exists = order.find((o) => o.id === item.id);
    if (exists) {
      setOrder((prev) => prev.map((o) => o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o));
    } else {
      setOrder((prev) => [...prev, { ...item, quantity: 1 }]);
    }
    setSelectedItem(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 pb-20 md:pb-4 p-4">
      <header className="bg-white shadow rounded-xl p-4 flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-orange-600">🐾 美味點餐</h1>
        <div className="text-sm text-gray-600 hidden md:block">點選喜愛的餐點加入清單</div>
      </header>

      {activeTab === 'home' && (
        <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-orange-600 mb-2">🍽 餐廳簡介</h2>
          <p className="text-gray-700 mb-4">我們是一家專注於家常台味便當的小餐館，堅持使用新鮮食材，為顧客提供最溫暖的味道。</p>
          <h3 className="text-lg font-semibold text-orange-500 mb-1">🕒 營業時間</h3>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            <li>週一至週五：11:00 - 14:00 / 17:00 - 20:00</li>
            <li>週六：11:00 - 14:00</li>
            <li>週日公休</li>
          </ul>
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/5">
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    category === cat ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {menuItems.filter(item => item.category === category).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white rounded-xl shadow p-3 flex flex-col cursor-pointer hover:ring-2 hover:ring-orange-300"
                >
                  <img src={item.image} alt={item.name} className="rounded w-full h-28 object-cover mb-2" />
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">${item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cart' && (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-orange-600">🧾 我的點單</h2>
          {order.length > 0 ? (
            <div>
              <ul className="space-y-2">
                {order.map((item) => (
                  <li key={item.id} className="flex justify-between items-center">
                    <div className="text-sm">
                      {item.name} x {item.quantity} = ${item.price * item.quantity}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      移除
                    </button>
                  </li>
                ))}
              </ul>
              <div className="text-right text-lg font-semibold mt-4">
                總計：<span className="text-orange-600">${total}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={clearOrder}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  清除清單
                </button>
                <button
                  onClick={submitOrder}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  送出訂單
                </button>
              </div>
              <div className="mt-6 border rounded p-4 bg-white inline-block">
                <p className="text-xs text-gray-500 mb-2">📱 掃描 QR Code 取得訂單</p>
                <QRCode value={JSON.stringify(order)} size={120} />
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">目前尚未選擇任何餐點</p>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full relative shadow-xl">
            <button onClick={() => setSelectedItem(null)} className="absolute top-2 right-2 text-gray-500 hover:text-black">✕</button>
            <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-40 object-cover rounded mb-4" />
            <h2 className="text-xl font-bold mb-2 text-orange-600">{selectedItem.name}</h2>
            <p className="text-sm text-gray-600 mb-4">{selectedItem.desc}</p>
            <p className="text-lg font-semibold mb-4">價格：${selectedItem.price}</p>
            <button
              onClick={() => addToOrder(selectedItem)}
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
            >
              加入點單
            </button>
          </div>
        </div>
      )}

      {/* 底部導覽列 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2 z-50">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center text-sm ${activeTab === 'home' ? 'text-orange-500' : 'text-gray-600'}`}>
          <Home size={20} />
          首頁
        </button>
        <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center text-sm ${activeTab === 'menu' ? 'text-orange-500' : 'text-gray-600'}`}>
          <Menu size={20} />
          菜單
        </button>
        <button onClick={() => setActiveTab('cart')} className={`flex flex-col items-center text-sm ${activeTab === 'cart' ? 'text-orange-500' : 'text-gray-600'}`}>
          <ShoppingCart size={20} />
          點單
        </button>
      </nav>
    </div>
  );
}

export default App;
