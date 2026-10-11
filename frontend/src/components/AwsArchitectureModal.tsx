import React, { useState } from 'react';
import { 
  X, 
  Server, 
  CheckCircle2
} from 'lucide-react';
import { AWS_ARCHITECTURE_DATA, AwsServiceDetail } from '../data/awsArchitectureData';

interface AwsArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AwsArchitectureModal: React.FC<AwsArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedService, setSelectedService] = useState<AwsServiceDetail>(AWS_ARCHITECTURE_DATA[0]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container aws-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Server className="text-caution" size={24} />
            <div>
              <h3 className="modal-title">AWS Production Architecture Blueprint</h3>
              <span className="modal-subtitle text-xs text-muted">
                Enterprise Cloud Infrastructure for 1.2M Punjab Farm Holdings
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body aws-modal-body">
          {/* Architecture Pipeline Flow Diagram */}
          <div className="arch-flow-diagram">
            <div className="flow-step">
              <span className="flow-tag">CLIENT PWA</span>
              <span className="flow-box">AWS Amplify (React PWA)</span>
            </div>
            <span className="flow-arrow">➔</span>
            <div className="flow-step">
              <span className="flow-tag">API LAYER</span>
              <span className="flow-box">API Gateway + Lambda</span>
            </div>
            <span className="flow-arrow">➔</span>
            <div className="flow-step">
              <span className="flow-tag">AI CORE</span>
              <span className="flow-box">SageMaker + Strands SDK</span>
            </div>
            <span className="flow-arrow">➔</span>
            <div className="flow-step">
              <span className="flow-tag">DATA & ALERTS</span>
              <span className="flow-box">DynamoDB + SNS + S3</span>
            </div>
          </div>

          <div className="aws-layout-split">
            {/* Services List on Left */}
            <div className="aws-services-menu">
              <span className="menu-heading">AWS Services Stack ({AWS_ARCHITECTURE_DATA.length})</span>
              <div className="services-list">
                {AWS_ARCHITECTURE_DATA.map(item => {
                  const isSelected = selectedService.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`service-list-item ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedService(item)}
                    >
                      <div className="service-name-row">
                        <span className="service-name font-bold">{item.serviceName}</span>
                        <span className="tag text-xs">{item.category}</span>
                      </div>
                      <span className="tag">{item.awsIconBadge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Service Detail on Right */}
            <div className="aws-detail-panel">
              <div className="detail-panel-header">
                <span className="tag">{selectedService.category}</span>
                <h4 className="detail-service-title font-bold">{selectedService.serviceName}</h4>
              </div>

              <div className="detail-section">
                <h5 className="detail-section-label">Role in JalFaasla:</h5>
                <p className="detail-text">{selectedService.purposeInJalFaasla}</p>
              </div>

              <div className="detail-section highlight-section">
                <h5 className="detail-section-label text-field">Punjab Agricultural Scaling Impact:</h5>
                <p className="detail-text font-bold">{selectedService.punjabScaleMetric}</p>
              </div>

              <div className="detail-section">
                <h5 className="detail-section-label">Key Cloud Architecture Feature:</h5>
                <p className="detail-text">{selectedService.keyFeature}</p>
              </div>

              <div className="tag">
                <CheckCircle2 size={16} className="text-field" />
                <span>AWS Hackathon Qualified: Ready for Amplify Hosting & Lambda Deploy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
