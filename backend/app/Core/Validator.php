<?php

namespace App\Core;

class Validator {
    private array $data;
    private array $rules;
    private array $errors = [];

    public function __construct(array $data, array $rules) {
        $this->data = $data;
        $this->rules = $rules;
    }

    public static function make(array $data, array $rules): self {
        $v = new self($data, $rules);
        $v->validate();
        return $v;
    }

    public function validate(): bool {
        foreach ($this->rules as $field => $ruleString) {
            $fieldRules = explode('|', $ruleString);
            $val = trim($this->data[$field] ?? '');

            foreach ($fieldRules as $r) {
                if ($r === 'required' && ($val === '' || $val === null)) {
                    $this->addError($field, "The " . ucfirst(str_replace('_', ' ', $field)) . " field is required.");
                    break;
                }

                if ($val === '') continue; // skip other validations if empty and not required

                if ($r === 'email' && !filter_var($val, FILTER_VALIDATE_EMAIL)) {
                    $this->addError($field, "The " . ucfirst(str_replace('_', ' ', $field)) . " must be a valid email address.");
                }

                if ($r === 'numeric' && !is_numeric($val)) {
                    $this->addError($field, "The " . ucfirst(str_replace('_', ' ', $field)) . " must be numeric.");
                }

                if (str_starts_with($r, 'min:')) {
                    $min = (int) substr($r, 4);
                    if (strlen($val) < $min) {
                        $this->addError($field, "The " . ucfirst(str_replace('_', ' ', $field)) . " must be at least {$min} characters.");
                    }
                }

                if (str_starts_with($r, 'max:')) {
                    $max = (int) substr($r, 4);
                    if (strlen($val) > $max) {
                        $this->addError($field, "The " . ucfirst(str_replace('_', ' ', $field)) . " must not exceed {$max} characters.");
                    }
                }

                if (str_starts_with($r, 'in:')) {
                    $options = explode(',', substr($r, 3));
                    if (!in_array($val, $options)) {
                        $this->addError($field, "The selected " . str_replace('_', ' ', $field) . " is invalid.");
                    }
                }

                if (str_starts_with($r, 'unique:')) {
                    $parts = explode(',', substr($r, 7));
                    $table = $parts[0];
                    $col = $parts[1] ?? $field;
                    $exceptId = $parts[2] ?? null;

                    $sql = "SELECT COUNT(*) as cnt FROM `{$table}` WHERE `{$col}` = :val";
                    $params = [':val' => $val];
                    if ($exceptId) {
                        $sql .= " AND `id` != :exceptId";
                        $params[':exceptId'] = (int) $exceptId;
                    }

                    $exists = Database::fetchOne($sql, $params);
                    if ($exists && (int)$exists['cnt'] > 0) {
                        $this->addError($field, "The " . str_replace('_', ' ', $field) . " has already been taken.");
                    }
                }
            }
        }

        return empty($this->errors);
    }

    private function addError(string $field, string $message): void {
        if (!isset($this->errors[$field])) {
            $this->errors[$field] = $message;
        }
    }

    public function passes(): bool {
        return empty($this->errors);
    }

    public function fails(): bool {
        return !empty($this->errors);
    }

    public function errors(): array {
        return $this->errors;
    }

    public function firstError(): ?string {
        return !empty($this->errors) ? reset($this->errors) : null;
    }
}
