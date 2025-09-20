import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Card, Hyperlink, Icon } from '@openedx/paragon';
import { ArrowForward } from '@openedx/paragon/icons';

import { reduxHooks } from 'hooks';
import moreCoursesSVG from 'assets/more-courses-sidewidget.svg';
import { baseAppUrl } from 'data/services/lms/urls';

import { findCoursesWidgetClicked } from './track';
import messages from './messages';
import './index.scss';

export const arrowIcon = (<Icon className="mx-1" src={ArrowForward} />);

export const LookingForChallengeWidget = () => {
  const { formatMessage } = useIntl();
  const { courseSearchUrl } = reduxHooks.usePlatformSettingsData();
  const hyperlinkDestination = 'https://cms.atenea.digital/activar-licencias/'//baseAppUrl(courseSearchUrl) || '';

  return (
    <Card orientation="horizontal" id="looking-for-challenge-widget">
      <Card.ImageCap
        src={moreCoursesSVG}
        srcAlt="course side widget"
      />
      <Card.Body className="m-auto pr-2">
        <h4>
          {formatMessage(messages.lookingForChallengePrompt)}
        </h4>
        <h5>
          <Hyperlink
            variant="brand"
            destination={hyperlinkDestination}
            onClick={findCoursesWidgetClicked(hyperlinkDestination)}
            className="d-flex align-items-center"
          >
            Activar licencia 
            <span class="pgn__icon mx-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false" aria-hidden="true">
                <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8Z" fill="currentColor"></path>
              </svg>
            </span>
            {/* {formatMessage(messages.findCoursesButton, { arrow: arrowIcon })} */}
          </Hyperlink>
        </h5>
      </Card.Body>
    </Card>
  );
};

LookingForChallengeWidget.propTypes = {};

export default LookingForChallengeWidget;
