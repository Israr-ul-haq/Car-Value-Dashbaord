function Version({ onFilter, versionText }) {
    return (
      <input
        type='text'
        className='form-control add-form-control'
        id='version'
        name='version'
        placeholder='1.0.0'
        required
        value={versionText}
        onChange={onFilter}
      />
    );
  }
  
  export default Version;