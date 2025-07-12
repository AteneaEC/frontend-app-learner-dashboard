import React from 'react';
import { Helmet } from 'react-helmet';

import { useIntl } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';
import { initializeHotjar } from '@edx/frontend-enterprise-hotjar';

import { ErrorPage, AppContext } from '@edx/frontend-platform/react';
import FooterSlot from '@openedx/frontend-slot-footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert } from '@openedx/paragon';

import { RequestKeys } from 'data/constants/requests';
import store from 'data/store';
import {
  selectors,
  actions,
} from 'data/redux';
import { reduxHooks } from 'hooks';
import Dashboard from 'containers/Dashboard';

import track from 'tracking';

import fakeData from 'data/services/lms/fakeData/courses';

import AppWrapper from 'containers/WidgetContainers/AppWrapper';
import LearnerDashboardHeader from 'containers/LearnerDashboardHeader';

import { getConfig } from '@edx/frontend-platform';
import messages from './messages';
import './App.scss';
import logofoot from './logo_foot.png';

export const App = () => {
  const { authenticatedUser } = React.useContext(AppContext);
  const { formatMessage } = useIntl();
  const isFailed = {
    initialize: reduxHooks.useRequestIsFailed(RequestKeys.initialize),
    refreshList: reduxHooks.useRequestIsFailed(RequestKeys.refreshList),
  };
  const hasNetworkFailure = isFailed.initialize || isFailed.refreshList;
  const { supportEmail } = reduxHooks.usePlatformSettingsData();
  const loadData = reduxHooks.useLoadData();

  React.useEffect(() => {
    if (authenticatedUser?.administrator || getConfig().NODE_ENV === 'development') {
      window.loadEmptyData = () => {
        loadData({ ...fakeData.globalData, courses: [] });
      };
      window.loadMockData = () => {
        loadData({
          ...fakeData.globalData,
          courses: [
            ...fakeData.courseRunData,
            ...fakeData.entitlementData,
          ],
        });
      };
      window.store = store;
      window.selectors = selectors;
      window.actions = actions;
      window.track = track;
    }
    if (getConfig().HOTJAR_APP_ID) {
      try {
        initializeHotjar({
          hotjarId: getConfig().HOTJAR_APP_ID,
          hotjarVersion: getConfig().HOTJAR_VERSION,
          hotjarDebug: !!getConfig().HOTJAR_DEBUG,
        });
      } catch (error) {
        logError(error);
      }
    }
  }, [authenticatedUser, loadData]);
  return (
    <>
      <Helmet>
        <title>{formatMessage(messages.pageTitle)}</title>
        <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
      </Helmet>
      <div>
        <AppWrapper>
          <LearnerDashboardHeader />
          <main>
            {hasNetworkFailure
              ? (
                <Alert variant="danger">
                  <ErrorPage message={formatMessage(messages.errorMessage, { supportEmail })} />
                </Alert>
              ) : (
                <Dashboard />
              )}
          </main>
        </AppWrapper>
        {/* <FooterSlot /> */}
        <div class="wrapper-footer wrapper">
          <footer class="primary container-fluid" role="contentinfo">
            <div class="row">
              <div class="col-sm1">
                <ul class="list-unstyled">
                  <li><b>COMPANÍA</b></li>
                  <li><a href="./about">Acerca de Atenea</a></li>
                  <li><a href="https://atenea.com.ec">Equipo</a></li>
                  <li><a href="./contact">Contacto</a></li>
                </ul>
              </div>
              <div class="col-sm1 uamx_footer-middle">
                <ul class="list-unstyled">
                  <li><b>PRODUCTOS</b></li>
                  <li><a href="./">Ecosistema Digital</a></li>
                  <li><a href="./">Sector Público</a></li>
                </ul>
              </div>
              <div class="col-sm1 uamx_footer-middle">
                <ul class="list-unstyled">
                  <li><b>LEGAL</b></li>
                  <li><a href="./privacy">Política de privacidad</a></li>
                  <li><a href="./tos">Términos del servicio</a></li>
                </ul>
              </div>
              <div class="col-sm1 last-col">
                <div class="footer-about-openedx">
                  <h5>
                    <a href="https://atenea.digital/">
                      <img src={logofoot} alt="Atenea" width="140" />
                    </a>
                  </h5>
                </div>
                {/* <p>Aprende en nuestras redes:</p> */}
                <div class="social-wrapper">
                  {/* <div class="social">
                    <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="facebook"><FontAwesomeIcon icon={faFacebook} className="fa" /></a>
                    <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="twitter"><FontAwesomeIcon icon={faTwitter} className="fa" /></a>
                    <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="youtube"><FontAwesomeIcon icon={faYoutube} className="fa" /></a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="instagram"><FontAwesomeIcon icon={faInstagram} className="fa" /></a>
                  </div> */}
                </div>
              </div>
            </div>
            <p class="copyright small">© 2025 <a href="https://atenea.digital/">Atenea Lifelong Learning</a></p>
          </footer>
        </div>
        
      </div>
    </>
  );
};

export default App;
