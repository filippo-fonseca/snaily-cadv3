import * as React from "react";
import { connect } from "react-redux";
import { addPenalCode } from "../../../../lib/actions/admin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import { Link, useHistory } from "react-router-dom";
import PenalCode from "../../../../interfaces/PenalCode";
import useDocTitle from "../../../../hooks/useDocTitle";

interface Props {
  addPenalCode: (data: Partial<PenalCode>) => Promise<boolean>;
}

const AddPenalCode: React.FC<Props> = ({ addPenalCode }) => {
  const [title, setTitle] = React.useState("");
  const [des, setDes] = React.useState("");
  const history = useHistory();
  useDocTitle("Add Penal Code");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const added = await addPenalCode({
      title,
      des,
    });

    if (added === true) {
      history.push("/admin/manage/penal-codes");
    }
  }

  return (
    <AdminLayout>
      <h1 className="h3">Add penal code</h1>

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="code">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            className="form-control bg-dark border-dark text-light"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="code">
            Description
          </label>
          <textarea
            rows={7}
            id="des"
            value={des}
            onChange={(e) => setDes(e.currentTarget.value)}
            className="form-control bg-dark border-dark text-light"
          ></textarea>
        </div>
        <div className="mb-3 float-end">
          <Link className="btn btn-danger mx-2" to="/admin/manage/penal-codes">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default connect(null, { addPenalCode })(AddPenalCode);
