import * as React from "react";
import Call from "../../interfaces/Call";
import State from "../../interfaces/State";
import lang from "../../language.json";
import Update911Call from "../modals/dispatch/Update911Call";
import { getActive911Calls } from "../../lib/actions/911-calls";
import { connect } from "react-redux";
import socket from "../../lib/socket";

interface Props {
  calls: Call[];
  getActive911Calls: () => void;
}

const ActiveCalls: React.FC<Props> = ({ calls, getActive911Calls }) => {
  React.useEffect(() => {
    getActive911Calls();
  }, [getActive911Calls]);

  React.useEffect(() => {
    socket.on("UPDATE_911_CALLS", () => getActive911Calls());
  }, [getActive911Calls]);

  return (
    <>
      <ul
        className="list-group overflow-auto mt-3"
        style={{ maxHeight: "25rem" }}
      >
        <li className="list-group-item bg-secondary border-secondary">
          {lang.global.active_erm_calls}
        </li>

        {!calls[0] ? (
          <li className="list-group-item bg-dark border-dark">
            {lang.global.no_calls}
          </li>
        ) : (
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{lang.dispatch.caller_name}</th>
                <th scope="col">{lang.dispatch.caller_location}</th>
                <th scope="col">{lang.dispatch.call_desc}</th>
                <th scope="col">{lang.dispatch.status}</th>
                <th scope="col">{lang.dispatch.assigned_unit}</th>
                <th scope="col">{lang.global.actions}</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call: Call, idx: number) => {
                return (
                  <tr id={`${idx}`} key={idx}>
                    <th scope="row">{++idx}</th>
                    <td>{call.name}</td>
                    <td>{call.location}</td>
                    <td>{call.description}</td>
                    <td>{call.status}</td>
                    <td>{call.assigned_unit.split(",").join(", ")}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-toggle="modal"
                        data-target={"#update911Call" + call.id}
                      >
                        {lang.dispatch.update_call}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </ul>
      {calls.map((call: Call, idx: number) => {
        return <Update911Call key={idx} id={call.id} call={call} />;
      })}
    </>
  );
};

const mapToProps = (state: State) => ({
  calls: state.calls.calls,
});

export default connect(mapToProps, { getActive911Calls })(ActiveCalls);
