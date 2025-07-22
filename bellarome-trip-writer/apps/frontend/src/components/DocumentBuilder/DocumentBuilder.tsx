import React, { useState } from 'react';

// Template Component Types
const COMPONENT_TYPES = {
  HEADER: 'header',
  HERO: 'hero',
  CONTENT: 'content',
  SERVICE_LIST: 'service_list',
  TIMELINE: 'timeline',
  PRICING: 'pricing',
} as const;

type ComponentType = typeof COMPONENT_TYPES[keyof typeof COMPONENT_TYPES];

// Component Library
const componentLibrary = [
  {
    id: 'header',
    type: COMPONENT_TYPES.HEADER,
    name: 'Header',
    icon: '📄',
    category: 'Layout',
    defaultProps: {
      backgroundColor: '#1a5490',
      height: 80,
      showLogo: true,
      showReference: true,
      title: 'BOOKING CONFIRMATION'
    }
  },
  {
    id: 'hero',
    type: COMPONENT_TYPES.HERO,
    name: 'Hero Section',
    icon: '🖼️',
    category: 'Layout',
    defaultProps: {
      height: 200,
      textColor: '#ffffff'
    }
  },
  {
    id: 'content',
    type: COMPONENT_TYPES.CONTENT,
    name: 'Content Block',
    icon: '📝',
    category: 'Layout',
    defaultProps: {
      title: 'Section Title',
      content: 'Enter your content here...',
      fontSize: 14,
      textAlign: 'left'
    }
  },
  {
    id: 'service_list',
    type: COMPONENT_TYPES.SERVICE_LIST,
    name: 'Service List',
    icon: '📋',
    category: 'Data',
    defaultProps: {
      serviceTypes: ['accommodation', 'transport', 'activities'],
      layout: 'card'
    }
  },
  {
    id: 'timeline',
    type: COMPONENT_TYPES.TIMELINE,
    name: 'Timeline',
    icon: '⏰',
    category: 'Data',
    defaultProps: {
      orientation: 'vertical',
      connectorColor: '#1a5490',
      showTimes: true
    }
  },
  {
    id: 'pricing',
    type: COMPONENT_TYPES.PRICING,
    name: 'Price Table',
    icon: '💰',
    category: 'Data',
    defaultProps: {
      showSubtotal: true,
      showDeposit: true,
      tableStyle: 'simple'
    }
  }
];

// Sample trip data
const sampleTripData = {
  reference: 'BR-2025-0142',
  title: 'Smith Family - Tuscany Adventure',
  startDate: '2025-03-15',
  endDate: '2025-03-22',
  duration: 7,
  totalTravelers: 4,
  contact: {
    fullName: 'John Smith',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1 555-0123'
  },
  price: {
    total: '€12,450',
    subtotal: '€11,200',
    deposit: '€2,490',
    currency: 'EUR'
  },
  services: [
    {
      name: 'Villa Toscana Resort',
      type: 'accommodation',
      date: 'Mar 15-22',
      description: '7 nights luxury accommodation'
    },
    {
      name: 'Private Wine Tour',
      type: 'activity',
      date: 'Mar 16',
      description: 'Full day Chianti region experience'
    }
  ]
};

// Types
interface TemplateComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
}

// Drag and Drop Hook
const useDragAndDrop = () => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dropZone, setDropZone] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, item: string) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, zone: string) => {
    e.preventDefault();
    setDropZone(zone);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropZone(null);
    }
  };

  const handleDrop = (e: React.DragEvent, onDrop: (item: string) => void) => {
    e.preventDefault();
    if (draggedItem) {
      onDrop(draggedItem);
      setDraggedItem(null);
      setDropZone(null);
    }
  };

  return {
    draggedItem,
    dropZone,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop
  };
};

// Component Renderer
interface ComponentRendererProps {
  component: TemplateComponent;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  data?: typeof sampleTripData;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ 
  component, 
  isSelected, 
  onSelect, 
  onDelete, 
  data = sampleTripData 
}) => {
  const replaceVariables = (text: string) => {
    if (!text) return '';
    return text.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const keys = path.split('.');
      let value: any = data;
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) break;
      }
      return value || match;
    });
  };

  const renderComponent = () => {
    switch (component.type) {
      case COMPONENT_TYPES.HEADER:
        return (
          <div 
            className="w-full text-white flex items-center justify-between p-5"
            style={{ 
              backgroundColor: component.props.backgroundColor,
              height: component.props.height 
            }}
          >
            {component.props.showLogo && (
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                BELLAROME
              </div>
            )}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 600 }}>
                {replaceVariables(component.props.title || 'BOOKING CONFIRMATION')}
              </div>
              {component.props.showReference && (
                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                  Reference: {replaceVariables('{{trip.reference}}')}
                </div>
              )}
            </div>
          </div>
        );

      case COMPONENT_TYPES.HERO:
        return (
          <div 
            className="w-full text-white flex flex-col items-center justify-center"
            style={{ 
              height: component.props.height,
              color: component.props.textColor,
              background: 'linear-gradient(to right, #2563eb, #1e40af)'
            }}
          >
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              {replaceVariables('{{trip.title}}')}
            </h1>
            <p style={{ fontSize: '16px', opacity: 0.9 }}>
              {replaceVariables('{{trip.startDate}} - {{trip.endDate}}')}
            </p>
          </div>
        );

      case COMPONENT_TYPES.CONTENT:
        return (
          <div className="w-full p-5">
            <h3 className="text-blue-600 font-semibold mb-3 text-lg">
              {replaceVariables(component.props.title)}
            </h3>
            <div 
              className="text-gray-700"
              style={{ 
                fontSize: component.props.fontSize,
                textAlign: component.props.textAlign,
                whiteSpace: 'pre-wrap'
              }}
            >
              {replaceVariables(component.props.content)}
            </div>
          </div>
        );

      case COMPONENT_TYPES.SERVICE_LIST:
        return (
          <div className="w-full p-5">
            <h3 className="text-blue-600 font-semibold mb-4 text-lg">Services Included</h3>
            <div className="space-y-4">
              {data.services.map((service, idx) => (
                <div key={idx} style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{service.name}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{service.date}</div>
                  <div style={{ fontSize: '14px', color: '#374151' }}>{service.description}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case COMPONENT_TYPES.TIMELINE:
        return (
          <div className="w-full p-5">
            <h3 className="text-blue-600 font-semibold mb-4 text-lg">Day by Day Itinerary</h3>
            <div style={{ position: 'relative', paddingLeft: '32px' }}>
              <div style={{ position: 'absolute', left: '16px', top: '0', bottom: '0', width: '2px', backgroundColor: '#d1d5db' }}></div>
              {data.services.map((service, idx) => (
                <div key={idx} style={{ position: 'relative', marginBottom: '24px' }}>
                  <div 
                    style={{ 
                      position: 'absolute', 
                      left: '-6px', 
                      top: '8px',
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      border: '3px solid white',
                      backgroundColor: component.props.connectorColor 
                    }}
                  ></div>
                  <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>Day {idx + 1}: {service.name}</div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{service.date}</div>
                    <div style={{ fontSize: '14px', color: '#374151' }}>{service.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case COMPONENT_TYPES.PRICING:
        return (
          <div className="w-full p-5">
            <h3 className="text-blue-600 font-semibold mb-4 text-lg">Price Summary</h3>
            <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
              {component.props.showSubtotal && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Subtotal:</span>
                  <span>{replaceVariables('{{price.subtotal}}')}</span>
                </div>
              )}
              {component.props.showDeposit && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Deposit Required:</span>
                  <span>{replaceVariables('{{price.deposit}}')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #d1d5db', fontWeight: 600 }}>
                <span>Total:</span>
                <span>{replaceVariables('{{price.total}}')}</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full p-5 text-center text-gray-500">
            Unknown component type: {component.type}
          </div>
        );
    }
  };

  return (
    <div
      className={`relative border-2 transition-all cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={() => onSelect(component.id)}
    >
      {isSelected && (
        <>
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-sm z-10" style={{ borderRadius: '0 0 0 4px' }}>
            {component.type.toUpperCase()}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(component.id);
            }}
            className="absolute bg-red-500 text-white hover:bg-red-600 transition-all z-10"
            style={{ top: '8px', left: '8px', width: '24px', height: '24px', borderRadius: '50%', fontSize: '12px' }}
          >
            ×
          </button>
        </>
      )}
      
      {renderComponent()}
    </div>
  );
};

// Properties Panel
interface PropertiesPanelProps {
  selectedComponent: TemplateComponent | null;
  onUpdateComponent: (id: string, newProps: Record<string, any>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedComponent, onUpdateComponent }) => {
  if (!selectedComponent) {
    return (
      <div className="text-center text-gray-500 p-8">
        <div className="text-4xl mb-2">⚙️</div>
        <div>Select a component to edit properties</div>
      </div>
    );
  }

  const handlePropertyChange = (property: string, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      ...selectedComponent.props,
      [property]: value
    });
  };

  const renderPropertyEditor = () => {
    switch (selectedComponent.type) {
      case COMPONENT_TYPES.HEADER:
        return (
          <div className="space-y-4">
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Background Color</label>
              <input
                type="color"
                value={selectedComponent.props.backgroundColor}
                onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                className="w-full h-10 border border-gray-200 rounded"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Height (px)</label>
              <input
                type="number"
                value={selectedComponent.props.height}
                onChange={(e) => handlePropertyChange('height', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-200 rounded"
                min="60"
                max="200"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Title</label>
              <input
                type="text"
                value={selectedComponent.props.title || 'BOOKING CONFIRMATION'}
                onChange={(e) => handlePropertyChange('title', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showLogo"
                checked={selectedComponent.props.showLogo}
                onChange={(e) => handlePropertyChange('showLogo', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showLogo" style={{ fontSize: '14px' }}>Show Logo</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showReference"
                checked={selectedComponent.props.showReference}
                onChange={(e) => handlePropertyChange('showReference', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showReference" style={{ fontSize: '14px' }}>Show Reference</label>
            </div>
          </div>
        );

      case COMPONENT_TYPES.CONTENT:
        return (
          <div className="space-y-4">
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Title</label>
              <input
                type="text"
                value={selectedComponent.props.title}
                onChange={(e) => handlePropertyChange('title', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Content</label>
              <textarea
                value={selectedComponent.props.content}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
                rows={4}
                placeholder="Use variables like {{trip.reference}} or {{contact.fullName}}"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Font Size</label>
              <input
                type="number"
                value={selectedComponent.props.fontSize}
                onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-200 rounded"
                min="10"
                max="24"
              />
            </div>
          </div>
        );

      default:
        return <div className="text-gray-500">No properties available for this component</div>;
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Properties</h3>
      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>{selectedComponent.type.replace('_', ' ').toUpperCase()}</div>
      {renderPropertyEditor()}
    </div>
  );
};

// Main Document Builder Component
const DocumentBuilder: React.FC = () => {
  const [templateComponents, setTemplateComponents] = useState<TemplateComponent[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState('Booking Confirmation');
  
  const {
    draggedItem,
    dropZone,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop
  } = useDragAndDrop();

  const selectedComponent = templateComponents.find(c => c.id === selectedComponentId) || null;

  const addComponent = (componentType: string) => {
    const libraryComponent = componentLibrary.find(c => c.type === componentType);
    if (!libraryComponent) return;

    const newComponent: TemplateComponent = {
      id: `${componentType}-${Date.now()}`,
      type: componentType as ComponentType,
      props: { ...libraryComponent.defaultProps }
    };

    setTemplateComponents(prev => [...prev, newComponent]);
    setSelectedComponentId(newComponent.id);
  };

  const updateComponent = (componentId: string, newProps: Record<string, any>) => {
    setTemplateComponents(prev =>
      prev.map(comp =>
        comp.id === componentId ? { ...comp, props: newProps } : comp
      )
    );
  };

  const removeComponent = (componentId: string) => {
    setTemplateComponents(prev => prev.filter(comp => comp.id !== componentId));
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
  };

  const exportTemplate = () => {
    const template = {
      templateName,
      templateId: `template-${Date.now()}`,
      version: '1.0.0',
      type: 'booking_confirmation',
      language: 'en',
      components: templateComponents,
      createdAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(template, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${templateName.toLowerCase().replace(/\s+/g, '-')}-template.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const onDropComponent = (draggedComponent: string) => {
    addComponent(draggedComponent);
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: '#f3f4f6',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Component Library Sidebar */}
      <div style={{
        width: '16rem',
        minWidth: '16rem',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        padding: '1rem',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Bellarome Template Builder</h2>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px', 
              fontSize: '14px' 
            }}
            placeholder="Template name"
          />
        </div>

        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '12px', color: '#374151' }}>Components</h3>
          
          {['Layout', 'Data'].map(category => (
            <div key={category} style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280', marginBottom: '8px' }}>{category}</div>
              {componentLibrary
                .filter(comp => comp.category === category)
                .map((component) => (
                  <div
                    key={component.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component.type)}
                    style={{ 
                      padding: '12px', 
                      marginBottom: '8px', 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px', 
                      cursor: 'grab', 
                      userSelect: 'none',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#93c5fd';
                      e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{component.icon}</span>
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{component.name}</span>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={exportTemplate}
            disabled={templateComponents.length === 0}
            style={{
              width: '100%',
              backgroundColor: templateComponents.length === 0 ? '#d1d5db' : '#2563eb',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: 500,
              cursor: templateComponents.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginBottom: '1rem'
            }}
            onMouseEnter={(e) => {
              if (templateComponents.length > 0) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }
            }}
            onMouseLeave={(e) => {
              if (templateComponents.length > 0) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
          >
            Export Template
          </button>
          <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
            {templateComponents.length} component{templateComponents.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div style={{
        flex: '1',
        overflow: 'auto',
        backgroundColor: '#f9fafb',
        padding: '1rem'
      }}>
        <div style={{
          maxWidth: '56rem',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: '8px',
            overflow: 'hidden',
            width: '210mm',
            minHeight: '297mm'
          }}>
            <div
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, 'canvas')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, onDropComponent)}
              className={`min-h-full transition-all ${
                dropZone === 'canvas' ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
              }`}
            >
              {templateComponents.length === 0 ? (
                <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', border: '2px dashed #d1d5db', margin: '32px', borderRadius: '8px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', marginBottom: '8px' }}>📄</div>
                    <div style={{ fontSize: '18px', fontWeight: 500, marginBottom: '4px' }}>Start Building Your Template</div>
                    <div style={{ fontSize: '14px' }}>Drag components from the sidebar to get started</div>
                  </div>
                </div>
              ) : (
                templateComponents.map((component) => (
                  <ComponentRenderer
                    key={component.id}
                    component={component}
                    isSelected={selectedComponentId === component.id}
                    onSelect={setSelectedComponentId}
                    onDelete={removeComponent}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div style={{
        width: '20rem',
        minWidth: '20rem',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid #e5e7eb',
        padding: '1rem',
        overflowY: 'auto'
      }}>
        <PropertiesPanel
          selectedComponent={selectedComponent}
          onUpdateComponent={updateComponent}
        />
      </div>
    </div>
  );
};

export default DocumentBuilder;