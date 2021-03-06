import React, { PropTypes } from 'react'
import { List, Set } from 'immutable'
import File from './file.js'
import Path from 'path'
import SearchField from '../containers/searchfield.js'
import FileControls from '../containers/filecontrols.js'
import DirectoryInfoBar from './directoryinfobar.js'

const FileList = ({files, selected, searchResults, path, showSearchField, actions}) => {
	const onBackClick = () => {
		if (path === '') {
			return
		}
		let newpath = Path.posix.join(path, '../')
		if (newpath === './') {
			newpath = ''
		}
		actions.setPath(newpath)
	}

	if (files === null) {
		return (
			<div className="file-list">
				<ul>
					<h2> Loading files... </h2>
				</ul>
			</div>
		)
	}

	let filelistFiles
	if (showSearchField) {
		filelistFiles = searchResults
	} else {
		filelistFiles = files
	}
	const fileElements = filelistFiles.map((file, key) => {
		const isSelected = selected.map((selectedfile) => selectedfile.name).includes(file.name)
		const onFileClick = (e) => {
			const shouldMultiSelect = e.ctrlKey || e.metaKey
			const shouldRangeSelect = e.shiftKey
			if (!shouldMultiSelect && !shouldRangeSelect) {
				actions.deselectAll()
			}
			if (shouldRangeSelect) {
				actions.selectUpTo(file)
			}
			if (shouldMultiSelect && isSelected) {
				actions.deselectFile(file)
			} else {
				actions.selectFile(file)
			}
		}
		const onDoubleClick = (e) => {
			e.stopPropagation()
			if (file.type === 'directory') {
				actions.setPath(Path.posix.join(path, file.name))
			}
		}
		return (
			<File
				key={key}
				selected={isSelected}
				filename={file.name}
				filesize={file.size}
				redundancy={file.redundancy}
				available={file.available}
				onDoubleClick={onDoubleClick}
				type={file.type}
				onClick={onFileClick}
			/>
		)
	})

	return (
		<div className="file-list">
			{showSearchField ? <SearchField /> : null}
			<ul>
				<DirectoryInfoBar path={path} nfiles={files.size} onBackClick={onBackClick} />
				{ fileElements.size > 0 ? fileElements : <h2> No files uploaded </h2> }
			</ul>
			{selected.size > 0 ? <FileControls /> : null}
		</div>
	)
}

FileList.propTypes = {
	files: PropTypes.instanceOf(List),
	selected: PropTypes.instanceOf(Set).isRequired,
	searchResults: PropTypes.instanceOf(List),
	path: PropTypes.string.isRequired,
	showSearchField: PropTypes.bool.isRequired,
}

export default FileList
