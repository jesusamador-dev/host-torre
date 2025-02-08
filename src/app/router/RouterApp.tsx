import React, { Suspense, lazy } from 'react';
import {BrowserRouter, Route, Routes, Outlet} from 'react-router-dom';
import SafeView from '../../safe/SafeView';
import TokenAuth from '../../presentation/components/TokenAuth';
const RouterSolicitudes = lazy(() => import('mf_mesacyc_dashboards_solicitudes/RouterSolicitudes'));
const ErrorLayout = lazy(() => import('mf_mesacyc_dashboards_common/ErrorLayout'));
import DSSpinner from 'mf_mesacyc_dashboards_common/DSSpinner';

const RouterApp: React.FC = () => {
  return (
    <BrowserRouter basename='/dashboards/v1'>
      <Suspense fallback={<DSSpinner></DSSpinner>}>
        <Routes>
          <Route element={<Outlet />}>
            <Route path='/token/:token' element={<TokenAuth></TokenAuth>} />
            <Route path='/solicitudes/*' element={
							<SafeView title="El módulo de solicitudes no está disponible de momento">
								<RouterSolicitudes />
							</SafeView>
						} />
          </Route>
          <Route path='/error' element={<ErrorLayout/>}></Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default RouterApp;
