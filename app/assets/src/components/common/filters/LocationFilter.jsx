import React from "react";
import PropTypes from "prop-types";
import { concat, forEach, values } from "lodash/fp";
import { BaseMultipleFilter } from "~/components/common/filters";

class LocationFilter extends React.Component {
  expandParents = options => {
    let parentOptions = {};
    forEach(option => {
      forEach(parent => {
        if (!parentOptions[parent]) {
          parentOptions[parent] = {
            text: parent,
            value: parent,
            count: option.count,
          };
        } else {
          parentOptions[parent].count += option.count;
        }
      }, option.parents || []);
    }, options);
    return concat(options, values(parentOptions));
  };

  render() {
    const { options, ...otherProps } = this.props;

    return (
      <BaseMultipleFilter
        {...otherProps}
        options={this.expandParents(options)}
      />
    );
  }
}

LocationFilter.propTypes = {
  options: PropTypes.array,
};

export default LocationFilter;