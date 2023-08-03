import { useEffect } from 'react';

const З_KEY = 'z';

const useMemento = ({ handleUndo, handleRedo }: { handleUndo: () => void, handleRedo: () => void }) => {
    useEffect(() => {
        const redoHandler = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'y') {
                event.preventDefault();
                handleRedo();
            }
        };

        const undoHandler = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === З_KEY) {
                event.preventDefault();
                handleUndo();
            }
        };

        document.addEventListener('keydown', redoHandler);
        document.addEventListener('keydown', undoHandler);

        return () => {
            document.removeEventListener('keydown', redoHandler);
            document.removeEventListener('keydown', undoHandler);
        };
    }, [handleUndo, handleRedo]);
};

export default useMemento;