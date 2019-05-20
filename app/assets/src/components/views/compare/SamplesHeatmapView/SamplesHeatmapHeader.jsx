import React from "react";
import PropTypes from "prop-types";

import { ViewHeader } from "~/components/layout";
import BasicPopup from "~/components/BasicPopup";
import { SaveButton, ShareButton } from "~ui/controls/buttons";
import { DownloadButtonDropdown } from "~ui/controls/dropdowns";
import { withAnalytics, logAnalyticsEvent } from "~/api/analytics";

import cs from "./samples_heatmap_view.scss";

const DOWNLOAD_OPTIONS = [
  { text: "Download CSV", value: "csv" },
  { text: "Download SVG", value: "svg" },
  { text: "Download PNG", value: "png" }
];

export default class SamplesHeatmapHeader extends React.Component {
  handleDownloadClick = fileType => {
    switch (fileType) {
      case "svg":
        // TODO (gdingle): pass in filename per sample?
        this.props.onDownloadSvg();
        break;
      case "png":
        // TODO (gdingle): pass in filename per sample?
        this.props.onDownloadPng();
        break;
      case "csv":
        this.props.onDownloadCsv();
        break;
      default:
        break;
    }
    logAnalyticsEvent("SamplesHeatmapHeader_download-button_clicked", {
      sampleIds: this.props.sampleIds.length,
      fileType
    });
  };

  render() {
    const { allowedFeatures, sampleIds } = this.props;

    return (
      <ViewHeader className={cs.viewHeader}>
        <ViewHeader.Content>
          <ViewHeader.Pretitle>Heatmap</ViewHeader.Pretitle>
          <ViewHeader.Title
            label={`Comparing ${sampleIds ? sampleIds.length : ""} Samples`}
          />
        </ViewHeader.Content>
        <ViewHeader.Controls className={cs.controls}>
          <BasicPopup
            trigger={
              <ShareButton
                onClick={withAnalytics(
                  this.props.onShareClick,
                  "SamplesHeatmapHeader_share-button_clicked",
                  {
                    sampleIds: sampleIds.length
                  }
                )}
                className={cs.controlElement}
              />
            }
            content="A shareable URL was copied to your clipboard!"
            on="click"
            hideOnScroll
          />
          {/* TODO: (gdingle): this is gated until we release data discovery */}
          {allowedFeatures &&
            allowedFeatures.includes("data_discovery") && (
              <SaveButton
                onClick={withAnalytics(
                  this.props.onSaveClick,
                  "SamplesHeatmapHeader_save-button_clicked",
                  {
                    sampleIds: sampleIds.length,
                    path: window.location.pathname
                  }
                )}
                className={cs.controlElement}
              />
            )}
          <DownloadButtonDropdown
            className={cs.controlElement}
            options={DOWNLOAD_OPTIONS}
            onClick={this.handleDownloadClick}
            disabled={!this.props.data}
          />
        </ViewHeader.Controls>
      </ViewHeader>
    );
  }
}

SamplesHeatmapHeader.propTypes = {
  allowedFeatures: PropTypes.arrayOf(PropTypes.string),
  sampleIds: PropTypes.arrayOf(PropTypes.number),
  data: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
  ),
  onDownloadSvg: PropTypes.func.isRequired,
  onDownloadPng: PropTypes.func.isRequired,
  onDownloadCsv: PropTypes.func.isRequired,
  onShareClick: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired
};