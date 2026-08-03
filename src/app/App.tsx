import { Provider } from 'react-redux';
import { useAppSelector } from './store/hooks';
import { store } from './store';
import { RacePage } from '@pages';
import { JoinMultiplayerForm } from '@features/multiplayer';

function AppContent() {
    const sessionId = useAppSelector(state => state.multiplayer.sessionId);
    return sessionId ? <RacePage /> : <JoinMultiplayerForm />;
}

export const App = () => {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}