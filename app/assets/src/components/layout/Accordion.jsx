import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import cs from "./accordion.scss";

class Accordion extends React.Component {
  state = {
    open: false
  };

  onToggle = () => {
    this.setState({
      open: !this.state.open
    });
  };

  render() {
    const { header, children, toggleable, className } = this.props;

    const open = this.props.open || this.state.open;

    return (
      <div className={cx(cs.accordion, className)}>
        <div
          className={cx(cs.header, toggleable && cs.toggleable)}
          onClick={this.props.onToggle || this.onToggle}
        >
          {header}
          <div className={cs.fill} />
          {toggleable && (
            <div className={cs.toggleContainer}>
              <i
                className={cx(
                  "fa",
                  open ? "fa-angle-up" : "fa-angle-down",
                  cs.toggleIcon
                )}
              />
            </div>
          )}
        </div>
        {(open || !toggleable) && <div className={cs.content}>{children}</div>}
      </div>
    );
  }
}

Accordion.propTypes = {
  className: PropTypes.string,
  toggleable: PropTypes.bool,
  // Accordion can be controlled or non-controlled.
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  header: PropTypes.node,
  children: PropTypes.node
};

Accordion.defaultProps = {
  toggleable: true
};

export default Accordion;