//make consistent with dataSource.ts in frontend
class DataSource {
    constructor(obj) {
        this._id = (obj != null && obj._id != null) ? obj._id : null;
        this.name = (obj != null && obj.name != null) ? obj.name : '';
        this.createdBy = (obj != null && obj.createdBy != null) ? obj.createdBy : '';
        this.createdDate = (obj != null && obj.createdDate != null) ? obj.createdDate : '';
        this.modifiedBy = (obj != null && obj.modifiedBy != null) ? obj.modifiedBy : '';
        this.modifiedDate = (obj != null && obj.modifiedDate != null) ? obj.modifiedDate : '';
    }
    _id;
    name;
    createdBy;
    createdDate;
    modifiedBy;
    modifiedDate;
}

module.exports = DataSource;