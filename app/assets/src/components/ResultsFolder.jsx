import React from "react";
import PropTypes from "prop-types";
import Divider from "./layout/Divider";
import { openUrl, downloadStringToFile } from "./utils/links";
import {
  RESULTS_FOLDER_STAGE_KEYS,
  RESULTS_FOLDER_STEP_KEYS,
} from "~/components/utils/resultsFolder";

class OutputFile extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.file = props.file;
  }

  conditionalOpenUrl = url => {
    if (url) {
      openUrl(this.file.url);
    }
  };

  render() {
    return (
      <tr
        className={`${this.file.url ? "" : "disabled-"}file-link`}
        onClick={this.conditionalOpenUrl.bind(this, this.file.url)}
      >
        <td>
          <i className="fa fa-file" />
          {this.file["displayName"]}
          <span className="size-tag"> -- {this.file["size"]}</span>
        </td>
      </tr>
    );
  }
}

class ConfigFile extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.stageDagJson = props.stageDagJson;
  }

  render() {
    return (
      <tr
        className="file-link"
        onClick={downloadStringToFile.bind(this, this.stageDagJson)}
      >
        <td>
          <i className="fa fa-file" />
          config.json
        </td>
      </tr>
    );
  }
}

const ResultsFolderStepDivider = () => {
  return (
    <tr key="last">
      <td>
        <Divider />
      </td>
    </tr>
  );
};

class ResultsFolderStep extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.step = props.step;
  }

  render() {
    const {
      stepDescriptionKey,
      readsAfterKey,
      filesKey,
      stepNameKey,
    } = RESULTS_FOLDER_STEP_KEYS;

    const description = this.step[stepDescriptionKey];
    const readsAfter = this.step[readsAfterKey];
    const fileList = this.step[filesKey];
    const stepName = this.step[stepNameKey];
    return (
      <tbody>
        <tr key="first">
          <td>
            Step <b>{stepName}</b>: {description}{" "}
            {readsAfter ? (
              <span>
                (<b>{readsAfter}</b> reads remained.)
              </span>
            ) : null}
          </td>
        </tr>
        {fileList.map((file, j) => {
          return <OutputFile file={file} key={j} />;
        })}
        <ResultsFolderStepDivider />
      </tbody>
    );
  }
}

class ResultsFolderStepList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.stepDict = props.stepDict;
  }

  render() {
    return Object.keys(this.stepDict).map((stepKey, i) => {
      const step = this.stepDict[stepKey];
      return <ResultsFolderStep step={step} key={i} />;
    });
  }
}

class ResultsFolder extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.fileUrl = props.filePath;
    this.filePath = this.fileUrl.split("/");
    this.stageDict = props.fileList;
    this.sampleName = props.sampleName;
    this.projectName = props.projectName;
    this.rawResultsUrl = props.rawResultsUrl;
  }

  gotoPath(path) {
    location.href = `${path}`;
  }

  render() {
    const {
      stageDescriptionKey,
      stageDagJsonKey,
      stepsKey,
      stageNameKey,
    } = RESULTS_FOLDER_STAGE_KEYS;
    return (
      <div className="results-folder">
        <div className="header">
          <span className="title">
            <span className="back" onClick={this.gotoPath.bind(this, "/")}>
              {this.filePath[0]}
            </span>
            <span className="path">{">"}</span>
            <span
              className="back"
              onClick={this.gotoPath.bind(
                this,
                `/home?project_id=${this.filePath[1]}`
              )}
            >
              {this.projectName}
            </span>
            <span className="path">/</span>
            <span
              className="back"
              onClick={this.gotoPath.bind(this, this.props.samplePath)}
            >
              {this.sampleName}
            </span>
            <span className="path">/</span>
            {this.filePath[3]}
          </span>
        </div>
        <div className="header">
          {!Object.keys(this.stageDict).length
            ? "No files to show"
            : Object.keys(this.stageDict).map((stageKey, k) => {
                const stage = this.stageDict[stageKey];
                const stageDescription = stage[stageDescriptionKey];
                const stageDagJson = stage[stageDagJsonKey] || "None";
                const stepDict = stage[stepsKey];
                const stageName = stage[stageNameKey];
                return (
                  <table key={k}>
                    <thead>
                      <tr>
                        <th>
                          {stageName}: {stageDescription}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <ConfigFile stageDagJson={stageDagJson} />
                      <ResultsFolderStepDivider />
                    </tbody>
                    <ResultsFolderStepList stepDict={stepDict} />
                  </table>
                );
              })}
          {this.rawResultsUrl ? (
            <table key="rawResults">
              <thead>
                <tr>
                  <th>Need an output that's not listed here?</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  className="file-link"
                  onClick={openUrl.bind(this, this.rawResultsUrl)}
                >
                  <td>Go to raw results folder</td>
                </tr>
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    );
  }
}

ResultsFolder.propTypes = {
  samplePath: PropTypes.string,
};

export default ResultsFolder;
