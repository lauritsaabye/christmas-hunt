// App.tsx
import { useEffect, useState } from 'react';
import './App.css';
import img2 from './assets/react.svg';
import { db } from './firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

type Item = {
  id: string;
  img: string;
  password: string;
  completed: boolean;
};

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorAnimation, setErrorAnimation] = useState<boolean>(false);

  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'puzzles'),
      (snapshot) => {
        const updatedData = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Item
        );
        setData(updatedData);
      },
      (error) => {
        console.error('Error fetching real-time updates: ', error);
      }
    );

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  const openDialog = (item: Item): void => {
    setSelectedItem(item);
    setIsDialogOpen(true);
    setErrorMessage(''); // Clear any previous error message
    setErrorAnimation(false);
  };

  const closeDialog = (): void => {
    setIsDialogOpen(false);
    setSelectedItem(null);
    setErrorMessage('');
    setErrorAnimation(false);
  };

  const onSubmit = async () => {
    // @ts-ignore
    const input = document.getElementById('code-input').value;

    console.log(selectedItem);
    console.log(input);
    if (selectedItem && selectedItem.password === input) {
      closeDialog();

      const docRef = doc(db, 'puzzles', selectedItem.id);
      try {
        await updateDoc(docRef, {
          completed: true,
        });
      } catch (error) {
        console.error('Error updating document: ', error);
        alert('ERROR');
      }
      return;
    }
    setErrorMessage('Incorrect code');
    setErrorAnimation(true);
    setTimeout(() => setErrorAnimation(false), 500); // Remove animation class after 500ms
  };

  return (
    <div className="App">
      <div className="grid-container">
        {data.map((item, index) => (
          <div
            key={index}
            className={`grid-item ${item.completed ? 'completed' : ''}`}
            onClick={() => openDialog(item)}
          >
            <img src={item.img} alt={`Item ${item.id}`} />
          </div>
        ))}
      </div>

      {isDialogOpen && selectedItem && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeDialog}>
              &times;
            </button>
            <img
              style={{ width: '20px', marginTop: '20px' }}
              src={selectedItem.img}
              alt={`Item ${selectedItem.id}`}
            />
            <input type="text" id="code-input" placeholder="Enter code" />
            {errorMessage && (
              <p className={`error-message ${errorAnimation ? 'shake' : ''}`}>
                {errorMessage}
              </p>
            )}
            <button onClick={onSubmit}>Enter</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
