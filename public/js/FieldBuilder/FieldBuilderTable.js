FieldBuilder.prototype._calcGenTableSizes = function(numOfTables){

	/* Константы */
	this.offsets.table = 0;
	this.minActiveSpaces.table = skinManager.skin.trumpOffset;
	this.offsets.dummy = 0;
	/*--*/

	var halfRows = Math.floor(grid.numRows / 2),
		tableCells = this.tableCells = this.opponentPlacement[0] ? Math.round(grid.numCols - 4 - grid.density* 1.5) : grid.numCols - 2,
		tableOffset = this.tableOffset = this.offsets.table* 2;

	if(tableCells <= 0){
		console.warn('Field builder: Negative amount of columns for field table (', tableCells, '), defaulting to 0\n', this);
		tableCells = 0;
	}

	//Пытаемся выровнять поля стола по центру
	var minTableSpace = skinManager.skin.width + this.minActiveSpaces.table,
		extraSpace = (tableCells * grid.cellWidth) / numOfTables - minTableSpace,
		tableWidth;

	if(extraSpace > 0 && numOfTables == this.tableOrder.length){
		this.offsets.table = this.offsets.dummy = extraSpace / 4;
		this.tableOffset = tableOffset = extraSpace / 2;
		tableWidth = (tableCells * grid.cellWidth - extraSpace / 2 * (numOfTables - 1)) / numOfTables;
	}
	else{
		tableWidth = (tableCells * grid.cellWidth - tableOffset * (numOfTables - 1)) / numOfTables;
	}

	var addedCell = numOfTables == this.tableOrder.length ? 1 : 0;

	this.dimensions.table = {
		width: tableWidth,
		height: (grid.density + addedCell) * grid.cellHeight
	};
	this.dimensions.dummy = {
		width: tableWidth*numOfTables + this.offsets.table * 2 * (numOfTables-1)
	};

	this.positions.table = grid.at(
		this.opponentPlacement[0] ? 1 + grid.density : 1,
		halfRows - 1,
		-this.offsets.table,
		-this.offsets.table,
		'middle left'
	);
	this.positions.dummy = this.positions.table;

};

FieldBuilder.prototype._calcSpecTableSizes = function(){
	var offset = this.tableOffset,
 		inRow = this.tablesInRow,
 		total = this.tableOrder.length,
		width = this.dimensions.table.width,
		height = this.dimensions.table.height,
		mult = Math.ceil(total/inRow),
		firstX = this.positions.table.x,
		y = this.positions.table.y - (mult - 1) * (height / 2),
		ci = 0,
		ri = 0,
		ti = inRow;

	this.positions.dummy.y = y;
	this.dimensions.dummy.height = height * mult + grid.cellHeight * (mult-1);
	
	this.tableOrder = this.possibleTableOrders[inRow - 1];

	for(var i = 0; i < total; i++){
		if(ti === 0){
			ti = inRow;
			ci = 0;
			ri++;
			y += height + grid.cellHeight;
		}
		var id = 'TABLE' + this.tableOrder[i];
		var x = firstX + (width + offset)*ci;

		this.positions[id] = {x: x, y: y};
		this.offsets[id] = this.offsets.table;
		this.dimensions[id] = {width: width, height: height};		
		this._notEnoughSpace(id, 'table', null, false, true);
		ti--;
		ci++;
	}
};