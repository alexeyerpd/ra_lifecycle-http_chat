import * as React from 'react';
import {App} from 'containers/App/App';
import {createRoot} from 'react-dom/client';
import {getRootContainer} from 'utils/helpers';

import './styles/root.scss';

const root = createRoot(getRootContainer());

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
