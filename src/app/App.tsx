import { Provider } from 'react-redux';
import { store } from './store';
import { RacePage } from '@pages';

export const App = () => {
    return (
        <Provider store={store}>
            <RacePage />
        </Provider>
    );
}