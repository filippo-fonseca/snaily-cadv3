import * as React from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import lang from "../../../../language.json";
import State from "../../../../interfaces/State";
import AlertMessage from "../../../../components/alert-message";
import { connect } from "react-redux";
import { getAllOfficers } from "../../../../lib/actions/admin";
import { Item, Span } from "../../../citizen/citizen-info";
import Officer from "../../../../interfaces/Officer";
import { Link } from "react-router-dom";
import useDocTitle from "../../../../hooks/useDocTitle";
import Loader from "../../../../components/loader";

interface Props {
  officers: Officer[];
  loading: boolean;
  getAllOfficers: () => void;
  deleteCompanyById: (id: string) => void;
}

const OfficersManagementPage: React.FC<Props> = ({ officers, loading, getAllOfficers }) => {
  const [filter, setFilter] = React.useState<string>("");
  const [filtered, setFiltered] = React.useState<Officer[]>(officers);
  useDocTitle("Officer Management");

  React.useEffect(() => {
    getAllOfficers();
  }, [getAllOfficers]);

  React.useEffect(() => {
    setFiltered(officers);
  }, [officers]);

  function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value);

    const filteredItems = officers.filter((officer: Officer) =>
      officer.officer_name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFiltered(filteredItems);
  }

  return (
    <AdminLayout>
      <div>
        <input
          type="text"
          value={filter}
          onChange={handleFilter}
          className="form-control bg-dark border-secondary mb-2 text-light"
          placeholder={lang.global.search}
        />
        {!officers[0] ? (
          <AlertMessage
            message={{ msg: "This CAD doesn't have any officers yet", type: "warning" }}
          />
        ) : !filtered[0] ? (
          <AlertMessage message={{ msg: "No officer found with that name", type: "warning" }} />
        ) : loading ? (
          <Loader />
        ) : (
          <ul className="list-group">
            {filtered.map((officer: Officer, idx: number) => {
              return (
                <li
                  key={idx}
                  className="list-group-item bg-dark border-secondary d-flex justify-content-between"
                >
                  <div>
                    {++idx} | {officer.officer_name}
                    <div className="mt-2">
                      <Item id="name">
                        <Span>{lang.dispatch.officer_dept}: </Span>
                        {officer.officer_dept}
                      </Item>

                      <Item id="callsign">
                        <Span>Callsign: </Span>
                        {officer.callsign || "None set"}
                      </Item>
                      <Item id="rank">
                        <Span>Rank: </Span>
                        {officer.rank || "None set"}
                      </Item>
                      <Item id="status">
                        <Span>ON/OFF Duty: </Span>
                        {officer.status}
                      </Item>
                      <Item id="status2">
                        <Span>Status: </Span>
                        {officer.status2}
                      </Item>
                    </div>
                  </div>

                  <div>
                    <Link className="btn btn-success" to={`officers/${officer.id}`}>
                      Manage
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  officers: state.admin.officers,
  loading: state.admin.loading,
});

export default connect(mapToProps, { getAllOfficers })(OfficersManagementPage);
