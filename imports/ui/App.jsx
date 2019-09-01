import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';

import Tasks from '../api/tasks.js';
import Task from './Task.jsx';

// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false
        };

        this.handleSubmit        = this.handleSubmit.bind(this);
        this.toggleHideCompleted = this.toggleHideCompleted.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        Tasks.insert({
            text,
            createdAt: new Date() // current time
        });

        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted
        });
    }

    renderTasks() {
        let filteredTasks = this.props.tasks;

        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }

        return filteredTasks.map((task) => (
            <Task key={task._id} task={task}/>
        ));
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Todo List ({this.props.incompleteCount})</h1>

                    <label className="hide-completed">
                        <input
                            type="checkbox"
                            readOnly
                            checked={this.state.hideCompleted}
                            onClick={this.toggleHideCompleted}
                        />
                        Hide Completed Tasks
                    </label>

                    <form className="new-task" onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            ref="textInput"
                            placeholder="Type to add new tasks"
                        />
                    </form>
                </header>

                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        );
    }
}

export default withTracker(() => {
    return {
        tasks:           Tasks.find({}, {sort: {createdAt: -1}}).fetch(),
        incompleteCount: Tasks.find({checked: {$ne: true}}).count()
    };
})(App);
