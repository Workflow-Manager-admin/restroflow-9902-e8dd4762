from flask_smorest import Blueprint, abort
from flask.views import MethodView
from flask import request
from marshmallow import Schema, fields, ValidationError

# Simulated in-memory table DB.
TABLES_DB = {}
NEXT_TABLE_ID = 1

blp = Blueprint(
    "TableManagement",
    "tables",
    url_prefix="/api/tables",
    description="Table management endpoints"
)

# Table status options
TABLE_STATUS_CHOICES = ["available", "occupied", "reserved", "needs_cleaning", "maintenance"]

# Schemas for validation
class TableSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    status = fields.Str(required=True)
    seats = fields.Int(required=True)
    note = fields.Str(missing="")


class TableUpdateSchema(Schema):
    name = fields.Str()
    status = fields.Str()
    seats = fields.Int()
    note = fields.Str()


@blp.route("/")
class TableListAPI(MethodView):
    # PUBLIC_INTERFACE
    def get(self):
        """List all tables"""
        return list(TABLES_DB.values()), 200

    # PUBLIC_INTERFACE
    def post(self):
        """Create a new table"""
        global NEXT_TABLE_ID
        try:
            data = TableSchema().load(request.get_json())
        except ValidationError as err:
            return {"error": err.messages}, 400
        if data["status"] not in TABLE_STATUS_CHOICES:
            return {"error": f"Invalid status: {data['status']}"}, 400
        data["id"] = NEXT_TABLE_ID
        NEXT_TABLE_ID += 1
        TABLES_DB[data["id"]] = data
        return data, 201


@blp.route("/<int:table_id>")
class TableDetailAPI(MethodView):
    # PUBLIC_INTERFACE
    def get(self, table_id):
        """Get table by ID"""
        table = TABLES_DB.get(table_id)
        if not table:
            abort(404, message="Table not found.")
        return table, 200

    # PUBLIC_INTERFACE
    def put(self, table_id):
        """Update (replace) a table"""
        try:
            data = TableSchema().load(request.get_json())
        except ValidationError as err:
            return {"error": err.messages}, 400
        if data["status"] not in TABLE_STATUS_CHOICES:
            return {"error": f"Invalid status: {data['status']}"}, 400
        if table_id not in TABLES_DB:
            abort(404, message="Table not found for update.")
        data["id"] = table_id
        TABLES_DB[table_id] = data
        return data, 200

    # PUBLIC_INTERFACE
    def patch(self, table_id):
        """Partial update of a table"""
        table = TABLES_DB.get(table_id)
        if not table:
            abort(404, message="Table not found for patch.")
        try:
            updates = TableUpdateSchema().load(request.get_json() or {})
        except ValidationError as err:
            return {"error": err.messages}, 400
        for k, v in updates.items():
            if k == "status" and v not in TABLE_STATUS_CHOICES:
                return {"error": f"Invalid status: {v}"}, 400
            table[k] = v
        TABLES_DB[table_id] = table
        return table, 200

    # PUBLIC_INTERFACE
    def delete(self, table_id):
        """Delete a table by ID"""
        if table_id not in TABLES_DB:
            abort(404, message="Table not found for delete.")
        del TABLES_DB[table_id]
        return {"message": "Table deleted"}, 204
