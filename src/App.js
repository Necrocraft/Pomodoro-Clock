import React from "react";
import "./App.css";

const moment = require("moment");
const Header = () => <h1 id="header">Pomodoro Clock</h1>;

const SetTimer = ({ type, value, handleClick }) => (
  <div className="SetTimer">
    <div id={`${type}-label`}>
      {type === "session" ? "Session " : "Break "}Length <hr />
    </div>
    <div className="SetTimer-controls">
      <button
        id={`${type}-decrement`}
        onClick={() => handleClick(false, `${type}Value`)}
      >
        &#8675;
      </button>
      <div id={`${type}-length`}>{value}</div>
      <button
        id={`${type}-increment`}
        onClick={() => handleClick(true, `${type}Value`)}
      >
        &#8673;
      </button>
    </div>
  </div>
);

const Controls = ({ active, handleReset, handlePlayPause }) => (
  <div className="controls">
    <button id="start_stop" onClick={handlePlayPause}>
      {active ? <span>&#10074;&#10074;</span> : <span>&#9658;</span>}
    </button>
    <button id="reset" onClick={handleReset}>
      &#8635;
    </button>
  </div>
);

const Timer = ({ mode, time }) => (
  <div className="Timer">
    <h1 id="timer-label">{mode === "session" ? "Session" : "Break"}</h1>
    <h1 id="time-left">{time}</h1>
  </div>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakValue: 5,
      sessionValue: 25,
      mode: "session",
      time: 25 * 60 * 1000,
      active: false,
      touched: false
    };
    this.handleSetTimers = this.handleSetTimers.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handlePlayPause = this.handlePlayPause.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.time === 0 && prevState.mode === "session") {
      this.setState({ time: this.state.breakValue * 60 * 1000, mode: "break" });
      this.audio.play();
    } else if (prevState.time === 0 && prevState.mode === "break") {
      this.setState({
        time: this.state.sessionValue * 60 * 1000,
        mode: "session"
      });
      this.audio.play();
    }
  }

  handleSetTimers = (inc, type) => {
    if (this.state[type] === 60 && inc) return;
    if (this.state[type] === 1 && !inc) return;
    this.setState({ [type]: this.state[type] + (inc ? 1 : -1) });
  };

  handleReset = () => {
    this.setState({
      breakValue: 5,
      sessionValue: 25,
      time: 25 * 60 * 1000,
      mode: "session",
      active: false,
      touched: false
    });
    clearInterval(this.pomodoro);
    this.audio.pause();
    this.audio.currentTime = 0;
  };

  handlePlayPause = () => {
    if (this.state.active) {
      clearInterval(this.pomodoro);
      this.setState({ active: false });
    } else {
      if (this.state.touched) {
        this.pomodoro = setInterval(
          () => this.setState({ time: this.state.time - 1000 }),
          1000
        );
        this.setState({ active: true });
      } else {
        this.setState(
          {
            time: this.state.sessionValue * 60 * 1000,
            touched: true,
            active: true
          },
          () =>
            (this.pomodoro = setInterval(
              () => this.setState({ time: this.state.time - 1000 }),
              1000
            ))
        );
      }
    }
  };

  render() {
    return (
      <div>
        <Header />
        <div className="settings">
          <SetTimer
            type="break"
            value={this.state.breakValue}
            handleClick={this.handleSetTimers}
          />
          <SetTimer
            type="session"
            value={this.state.sessionValue}
            handleClick={this.handleSetTimers}
          />
        </div>
        <Timer
          mode={this.state.mode}
          time={moment(this.state.time)
            .subtract(30, "minutes")
            .format("mm:ss")}
        />
        <Controls
          active={this.state.active}
          handleReset={this.handleReset}
          handlePlayPause={this.handlePlayPause}
        />
        <audio
          id="beep"
          src="http://dpoetry.com/test/games/package/files/constructFiles/Files/alert%20loop.wav"
          ref={el => (this.audio = el)}
        ></audio>
      </div>
    );
  }
}

export default App;
