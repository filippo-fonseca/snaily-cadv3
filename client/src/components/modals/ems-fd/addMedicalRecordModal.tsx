import * as React from "react";
import { connect } from "react-redux";
import Modal, { XButton } from "..";
import Citizen from "../../../interfaces/Citizen";
import State from "../../../interfaces/State";
import lang from "../../../language.json";
import { getAllCitizens } from "../../../lib/actions/admin";
import { createMedicalRecord } from "../../../lib/actions/citizen";
import Select from "../../select";

interface Props {
  citizens: Citizen[];
  getAllCitizens: () => void;
  createMedicalRecord: (
    data: object,
    citizenId: string,
    shouldReturn?: boolean,
  ) => Promise<boolean | string>;
}

const AddMedicalRecord: React.FC<Props> = ({ citizens, getAllCitizens, createMedicalRecord }) => {
  const [citizenId, setCitizenId] = React.useState("");
  const [type, setType] = React.useState("");
  const [description, setDescription] = React.useState("");
  const btnRef = React.createRef<HTMLButtonElement>();

  React.useEffect(() => {
    getAllCitizens();
  }, [getAllCitizens]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!citizenId) return;

    const success = await createMedicalRecord(
      {
        type,
        shortInfo: description,
      },
      citizenId,
      false,
    );

    if (success) {
      btnRef.current?.click();

      setCitizenId("");
      setType("");
      setDescription("");
    }
  }

  return (
    <Modal id="addMedicalRecord" size="lg">
      <div className="modal-header">
        <h5 className="modal-title">Add medical record</h5>
        <XButton ref={btnRef} />
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">Select type</label>

            <Select
              isClearable={false}
              onChange={(v) => setType(v?.value)}
              value={{ label: type, value: type }}
              isMulti={false}
              options={[
                {
                  label: "Allergy",
                  value: "Allergy",
                },
                {
                  label: "Medication",
                  value: "Medication",
                },
                {
                  label: "Health Problem",
                  value: "Health Problem",
                },
              ]}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Citizen name</label>
            <Select
              options={citizens.map((citizen) => ({ label: citizen.full_name, value: citizen.id }))}
              closeMenuOnSelect={true}
              isMulti={false}
              onChange={(v: any) => setCitizenId(v.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control bg-secondary border-secondary text-light"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button disabled={!citizenId} type="submit" className="btn btn-primary">
            Add medical record
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  citizens: state.admin.citizens,
});

export default connect(mapToProps, { getAllCitizens, createMedicalRecord })(AddMedicalRecord);
