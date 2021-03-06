import React from "react";
import PropTypes from "prop-types";

import { logAnalyticsEvent } from "~/api/analytics";
import BasicPopup from "~/components/BasicPopup";
import InfoIconSmall from "~ui/icons/InfoIconSmall";
import cs from "./help_icon.scss";

class HelpIcon extends React.Component {
  handleTriggerEnter = () => {
    const { analyticsEventName, analyticsEventData } = this.props;
    if (analyticsEventName) {
      logAnalyticsEvent(analyticsEventName, analyticsEventData);
    }
  };

  render() {
    const { className, text } = this.props;
    return (
      <BasicPopup
        trigger={
          <div className={className} onMouseEnter={this.handleTriggerEnter}>
            <InfoIconSmall className={cs.helpIcon} />
          </div>
        }
        hoverable
        inverted={false}
        basic={false}
        size="small"
        position="top center"
        content={<div className={cs.tooltip}>{text}</div>}
      />
    );
  }
}

HelpIcon.propTypes = {
  analyticsEventData: PropTypes.object,
  analyticsEventName: PropTypes.string,
  className: PropTypes.string,
  text: PropTypes.node,
};

export default HelpIcon;
